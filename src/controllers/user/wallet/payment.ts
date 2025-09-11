import { Request, Response } from "express";
import AppError from "../../../utils/error";
import PaymentHistory from "../../../models/paymentHistory";

export const walletPayment = async (req: Request, res: Response) => {
    const { transaction_id, amount } = req.body;
      const userId = (req as any).user?.user_id;
    
    // Validate input
    if(!transaction_id || ! amount) throw new AppError(400, "Please provide transaction id and amount!");

    // Create payment history
    const result = await PaymentHistory.create({
        user_id: userId,
        transaction_id,
        paid_amount: amount,
        payment_type: "wallet",
        paidAt: new Date()
    });

    res.json({
        success: true,
        message: "Wallet payment requested successfully.",
        data: result
    });
};
