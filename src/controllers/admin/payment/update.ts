import { Request, Response } from "express";
import PaymentHistory from "../../../models/paymentHistory";
import Wallet from "../../../models/wallet";
import AppError from "../../../utils/error";

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const { id, status } = req.body;

    if (!id || !status) {
        throw new AppError(400, "Please provide payment id and status.");
    }
    const payment = await PaymentHistory.findById(id);
    if (!payment) {
        throw new AppError(400, "Payment data not found");
    }

    // Find wallet
    const wallet = await Wallet.findOne({ user_id: payment.user_id });
    if (!wallet) {
        throw new AppError(400, "Wallet data not found");
    }

    // Update payment status
    const paymentData = await PaymentHistory.findByIdAndUpdate(id, { status });

    if (status === "accepted") {
      // Update wallet balance
      await Wallet.findOneAndUpdate(
        { user_id: payment.user_id },
        { $inc: { balance: payment.paid_amount, credit: payment.paid_amount } }
      );
    }

    res.json({
        success: true,
        message: "Payment status updated successfully.",
        data: paymentData,
    });
};