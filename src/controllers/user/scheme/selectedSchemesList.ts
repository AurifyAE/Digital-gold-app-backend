import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";
import SelectedScheme from "../../../models/selectedScheme";

export const selectedSchemesList = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    // Find selected schemes by user_id
    const selectedSchemes = await SelectedScheme.find({ user_id: userId })
        .select("_id scheme_id balance_payout payment_date")
        .populate({
            path: "scheme_id",
            select: "name months monthly_pay amount bonus",
            model: "Scheme"
        });
    
    res.json({
        success: true,
        message: "Selected schemes fetched successfully.",
        data: selectedSchemes
    });
}