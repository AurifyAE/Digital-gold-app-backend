import { Request, Response } from "express";
import AppError from "../../../utils/error";
import { stripe } from "../../../services/stripePayment";
import PaymentHistory from "../../../models/paymentHistory";
import Wallet from "../../../models/wallet";

export const walletPayment = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const userId = (req as any).user?.user_id;
    
    // Validate input
    if (!amount) throw new AppError(400, "Please provide amount!");
    
    const findWallet = await Wallet.findOne({ user_id: userId });
    if (!findWallet) throw new AppError(400, "Wallet not found.");

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "aed",
        automatic_payment_methods: { enabled: true },
        description: "Wallet payment",
    });
    
    res.json({
        success: true,
        message: "Wallet payment requested successfully.",
        data: {
            clientSecret: paymentIntent.client_secret
        }
    })
};

export const paymentSuccess = async (req: Request, res: Response) => {
    const { payment_id, amount } = req.body;
    const userId = (req as any).user?.user_id;
    
    // Validate input
    if (!payment_id || !amount) throw new AppError(400, "Please provide payment id and amount!");

    const findWallet = await Wallet.findOne({ user_id: userId });
    if (!findWallet) throw new AppError(400, "Wallet not found.");

    const convertAmount = amount / 100;

    const walletId = findWallet._id;

    // Create payment history
    await PaymentHistory.create({
        user_id: userId,
        transaction_id: payment_id,
        wallet_id: walletId,
        paid_amount: convertAmount,
        payment_type: "wallet",
        paidAt: new Date(),
        status: "success"
    });

    // Update wallet balance
    await Wallet.findOneAndUpdate(
        { user_id: userId },
        { $inc: { balance: convertAmount, credit: convertAmount } }
    );

    res.json({
        success: true,
        message: "Wallet payment success.",
        data: {}
    });
}