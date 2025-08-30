import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";
import SelectedScheme from "../../../models/selectedScheme";

export const selectScheme = async (req: Request, res: Response) => {
    const { scheme_id, pay_amount, payment_date } = req.body;
    const userId = (req as any).user?._id;

    // Validate input
    if (!scheme_id || !pay_amount || !payment_date) {
        throw new AppError(400, "Please provide scheme id and payment details.");
    }

    // Check if scheme exists
    const findScheme = await Scheme.findById(scheme_id);
    if (!findScheme) {
        throw new AppError(400, "Scheme not found.");
    }

    // Calculate balance payout
    const balance_payout = findScheme.amount - pay_amount;

    // Create selected scheme
    const selectedScheme = await SelectedScheme.create({
        user_id: userId,
        scheme_id,
        balance_payout,
        payment_date
    });
    
    res.json({
        success: true,
        message: "Scheme selected successfully.",
        data: selectedScheme
    });
}