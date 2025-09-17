import AppError from "../utils/error";
import SelectedScheme from "../models/selectedScheme";
import Scheme from "../models/scheme";
import paymentHistory from "../models/paymentHistory";
import Wallet from "../models/wallet";
import { generateTransactionId } from "../services/transactionId";

export const schemePaymentScheduler = async () => {
    try {
        console.log("Start creating scheme payments");
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const schemes = await SelectedScheme.find({
            status: "active",
            next_payment_date: {
                $gte: today,
                $lt: tomorrow
            },
            balance_payout: { $gt: 0 }
        });

        for (let i = 0; i < schemes.length; i++) {
            const scheme = schemes[i];
            const userId = scheme.user_id;
            const schemeId = scheme.scheme_id;

            // If the balance payout amount less than equals to zero then update the status completed
            if (scheme.balance_payout <= 0) {
                await SelectedScheme.findByIdAndUpdate(schemeId, { $set: { status: "completed" } });
                continue;
            }

            const findScheme: any = await Scheme.findById(schemeId);
            const monthlyPay = findScheme.monthly_pay;

            const transactionId = generateTransactionId();

            // Add to pending payment history
            await paymentHistory.create({
                user_id: userId,
                selected_scheme_id: scheme._id,
                paid_amount: monthlyPay,
                payment_type: "scheme",
                paidAt: new Date(),
                transaction_id: transactionId,
                status: "paid"
            });

            // const nextPayment = new Date(today.getDate() + 30);
            const nextPayment = today;
            nextPayment.setDate(nextPayment.getDate() + 30);

            // Update selected scheme balance payout
            await SelectedScheme.updateOne(
                { _id: scheme._id },
                {
                    $set: { next_payment_date: nextPayment },
                    $inc: { balance_payout: - monthlyPay }
                }
            );

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                { $inc: { balance: -monthlyPay, debit: monthlyPay } }
            )
        }
        console.log("Done creating scheme payments");
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}