import { Request, Response } from "express";
import AppError from "../../../utils/error";
import paymentHistory from "../../../models/paymentHistory";
import SelectedScheme from "../../../models/selectedScheme";

export const payment = async (req: Request, res: Response) => {
    const { selected_scheme_id, pay_amount } = req.body;
    const userId = (req as any).user?._id;

    // Validate input
    if (!selected_scheme_id || !pay_amount) {
        throw new AppError(400, "Please provide scheme id and payment details.");
    }

    // Check if selected scheme exists
    const findSelectedScheme = await SelectedScheme.findById({ _id: selected_scheme_id });
    if (!findSelectedScheme) {
        throw new AppError(404, "Selected scheme not found.");
    }

    // Calculate balance payout
    const balance_payout = findSelectedScheme.balance_payout - pay_amount;

    // Add payment history
    await paymentHistory.create({
        user_id: userId,
        selected_scheme_id,
        paid_amount: pay_amount,
        paidAt: new Date()
    });

    // Update selected scheme balance payout
    await SelectedScheme.findByIdAndUpdate({ _id: selected_scheme_id }, { balance_payout });

    res.json({
        success: true,
        message: "Payment completed successfully.",
        data: {}
    });
}