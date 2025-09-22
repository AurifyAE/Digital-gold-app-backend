import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Kyc from "../../../models/kyc";

export const getKyc = async (req: Request, res: Response) => {
    const userId = (req as any).user?.user_id;

    // Check if kyc exists
    const kyc = await Kyc.findOne({ user_id: userId });
    if (!kyc) throw new AppError(404, "Kyc not found.");
    
    res.json({
        success: true,
        message: "Kyc fetched successfully.",
        data: kyc,
    });
};