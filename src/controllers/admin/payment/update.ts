import { Request, Response } from "express";
import PaymentHistory from "../../../models/paymentHistory";
import AppError from "../../../utils/error";

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const { id, status } = req.body;

    if (!id || !status) {
        throw new AppError(400, "Please provide payment id and status.");
    }
    const payment = await PaymentHistory.findById(id);
    if (!payment) {
        throw new Error("Payment data not found");
    }

    const paymentData = await PaymentHistory.findByIdAndUpdate(id, { status });

    res.json({
        success: true,
        message: "Payment status updated successfully.",
        data: paymentData,
    });
};