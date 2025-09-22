import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Kyc from "../../../models/kyc";

export const updateKyc = async (req: Request, res: Response) => {
    const { kyc_id, emirates_id, passport_no, source_of_funds } = req.body;

    if (!kyc_id) throw new AppError(400, "Please provide kyc id!");

    // Check if kyc exists
    const kyc = await Kyc.findById(kyc_id);
    if (!kyc) throw new AppError(404, "Kyc not found.");
    // Check kyc status rejected then only update the data
    if (kyc.status !== "rejected")
        throw new AppError(400, "The Kyc status must be rejected!");

    // Uploaded files
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };

    const emiratesIdFrontImg = files["emirates_id_front_img"]?.[0]?.filename;
    const emiratesIdBackImg = files["emirates_id_back_img"]?.[0]?.filename;
    const visaCopyImg = files["visa_copy"]?.[0]?.filename;

    const kycData: any = {};

    const addIfValid = (key: string, value: any) => {
        if (value !== undefined && value !== "") kycData[key] = value;
    };

    addIfValid("emirates_id", emirates_id);
    addIfValid("passport_no", passport_no);
    addIfValid("source_of_funds", source_of_funds);

    if (emiratesIdFrontImg)
        kycData.emirates_id_front_img = emiratesIdFrontImg;

    if (emiratesIdBackImg)
        kycData.emirates_id_back_img = emiratesIdBackImg;

    if (visaCopyImg)
        kycData.visa_copy = visaCopyImg;

    if (Object.keys(kycData).length === 0)
        throw new AppError(400, "Please provide at least one field to update.");

    await Kyc.findByIdAndUpdate(kyc_id, kycData);

    res.json({
        success: true,
        message: "Kyc updated successfully.",
        data: {}
    });
}
