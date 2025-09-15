import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";
import SelectedScheme from "../../../models/selectedScheme";
import PaymentHistory from "../../../models/paymentHistory";
import Wallet from "../../../models/wallet";
import { generateTransactionId } from "../../../services/transactionId"

export const selectScheme = async (req: Request, res: Response) => {
    const { scheme_id, pay_amount } = req.body;
    const userId = (req as any).user?.user_id;

    // Validate input
    if (!scheme_id || !pay_amount) {
        throw new AppError(400, "Please provide scheme id and payment details.");
    }

    // Check if scheme exists
    const findScheme = await Scheme.findById(scheme_id);
    if (!findScheme) {
        throw new AppError(400, "Scheme not found.");
    }

    // Check if user has enough balance
    const findWallet: any = await Wallet.findOne({ user_id: userId });
    if (findWallet.balance < pay_amount)
        throw new AppError(400, "User does not have enough wallet balance!");

    // Calculate balance payout
    const balance_payout = findScheme.amount - pay_amount;

    // Create selected scheme
    const selectedScheme = await SelectedScheme.create({
        user_id: userId,
        scheme_id,
        balance_payout
    });

    const transactionId = generateTransactionId();

    // Add user selected scheme payment history
    await PaymentHistory.create({
        user_id: userId,
        selected_scheme_id: selectedScheme._id,
        payment_type: "scheme",
        paid_amount: pay_amount,
        transaction_id: transactionId,
        paidAt: new Date(),
        status: "paid"
    });

    // Update wallet balance
    await Wallet.findOneAndUpdate(
      { user_id: userId },
      {
        $inc: {
          balance: -pay_amount,
          debit: pay_amount,
        },
      }
    );

    // Update user selected scheme not editable
    await Scheme.findByIdAndUpdate({ _id: scheme_id }, { editable: false });
    
    res.json({
        success: true,
        message: "Scheme selected successfully.",
        data: selectedScheme
    });
}