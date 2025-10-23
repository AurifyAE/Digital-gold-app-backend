import { Request, Response } from "express";
import AppError from "../../../utils/error";
import { stripe } from "../../../services/stripePayment";
import PaymentHistory from "../../../models/paymentHistory";
import Wallet from "../../../models/wallet";

export const walletPayment = async (req: Request, res: Response) => {
    // const { transaction_id, amount } = req.body;
    const { amount } = req.body;
    const userId = (req as any).user?.user_id;
    
    // Validate input
    // if (!transaction_id || !amount) throw new AppError(400, "Please provide transaction id and amount!");
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
    // const walletId = findWallet._id;

    // // Create payment history
    // const result = await PaymentHistory.create({
    //     user_id: userId,
    //     transaction_id,
    //     wallet_id: walletId,
    //     paid_amount: amount,
    //     payment_type: "wallet",
    //     paidAt: new Date()
    // });

    // res.json({
    //     success: true,
    //     message: "Wallet payment requested successfully.",
    //     data: result
    // });
};
