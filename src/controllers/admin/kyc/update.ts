import { Request, Response } from "express";
import Kyc from "../../../models/kyc";
import User from "../../../models/user";

export const updateKycStatus = async (req: Request, res: Response) => {
    const { kyc_id, status, reason } = req.body;

    if (!kyc_id || !status) {
        return res.status(400).json({
            success: false,
            message: "kyc id and status are required",
        });
    }

    // Validate status is one of allowed values
    const allowedStatuses = ["approved", "rejected", "under_review"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        });
    }

    const kycDoc = await Kyc.findById(kyc_id);
    if (!kycDoc) {
        return res.status(404).json({
            success: false,
            message: "KYC record not found",
        });
    }

    if (reason !== "" && reason !== undefined)
        kycDoc.reason = reason;

    kycDoc.status = status;
    await kycDoc.save();

    // If status is approved, update user kyc_verified
    if (status === "approved") {
        await User.findByIdAndUpdate(kycDoc.user_id, {
            $set: { kyc_verified: true },
        });
    }

    res.json({
        success: true,
        message: `KYC status updated to '${status}' successfully.`,
        data: {}
    });
};
