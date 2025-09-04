import { Request, Response } from "express";
import AppError from "../../../utils/error";
import paymentHistory from "../../../models/paymentHistory";
import Aim from "../../../models/aim";

export const aimPayment = async (req: Request, res: Response) => {
    const { payment_id, aim_id, amount } = req.body;

    // Validate input
    if (!payment_id || !aim_id || !amount)
        throw new AppError(400, "Please provide payment id, aim id and payment amount!");

    // Check if selected aim exists
    const findSelectedAim = await Aim.findById({ _id: aim_id });
    if (!findSelectedAim) {
        throw new AppError(404, "Aim not found.");
    }

    // Calculate balance payout and current saved
    const balance_payout = findSelectedAim.amount - amount;
    const current_saved = findSelectedAim.current_saved + amount;

    // Find payment
    const findPayment = await paymentHistory.findOne({ _id: payment_id });
    if (!findPayment) {
        throw new AppError(404, "Payment not found.");
    }

    if (findPayment.paid_amount === amount) {
        await paymentHistory.findByIdAndUpdate(
            { _id: payment_id },
            {
                paid_amount: amount,
                paidAt: new Date(),
                status: "requested"
            }
        );
    } else {
        throw new AppError(400, "Payment amount does not match.");
    }

    // Update selected aim balance payout and current saved
    await Aim.findByIdAndUpdate({ _id: aim_id }, { balance_payout }, { current_saved });

    res.json({
        success: true,
        message: "Payment successful!"
    });
}