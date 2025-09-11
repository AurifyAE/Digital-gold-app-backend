import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Address from "../../../models/address";

export const getAddress = async (req: Request, res: Response) => {
    const userId = (req as any).user?.user_id;

    // Check if address exists
    const address = await Address.findOne({ user_id: userId });
    if (!address) {
        throw new AppError(404, "Address not found.");
    }
    
    res.json({
        success: true,
        message: "Address fetched successfully.",
        data: address,
    });
};