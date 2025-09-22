import AppError from "../utils/error";
import Aim from "../models/aim";
import paymentHistory from "../models/paymentHistory";
import Wallet from "../models/wallet";
import { generateTransactionId } from "../services/transactionId";

export const aimPaymentsDailyScheduler = async () => {
    try {
        console.log("Start creating daily aim payments");
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const aims = await Aim.find({
            status: "active",
            payment_cycle: "daily",
            next_payment_date: {
                $gte: today,
                $lt: tomorrow
            },
            balance_payout: { $gt: 0 }
        });

        for (let i = 0; i < aims.length; i++) {
            const aim = aims[i];

            const userId = aim.user_id;
            const transactionId = generateTransactionId();

            // Add to pending payment history
            await paymentHistory.create({
                user_id: userId,
                aim_id: aim._id,
                paid_amount: aim.calculated_emi,
                payment_type: "aim",
                paidAt: new Date(),
                transaction_id: transactionId,
                status: "paid"
            });

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                { $inc: { balance: - aim.calculated_emi, debit: aim.calculated_emi } }
            );

            const nextPayment = today
            nextPayment.setDate(today.getDate() + 1);

            // Update next payment date to tomorrow
            await Aim.findByIdAndUpdate(aim._id, {
                $set: { next_payment_date: nextPayment },
                $inc: {
                    balance_payout: - aim.calculated_emi,
                    current_saved: aim.calculated_emi,
                }
            });

            // If the balance payout amount less than equals to zero then update the status completed
            await Aim.findByIdAndUpdate(aim._id,
                { balance_payout: { $lte: 0 }, status: "active" },
                { $set: { status: "completed" } }
            );
        }
        console.log("Done creating daily aim payments");
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}

export const aimPaymentsWeeklyScheduler = async () => {
    try {
        console.log("Start creating weekly aim payments");
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const aims = await Aim.find({
            status: "active",
            payment_cycle: "weekly",
            next_payment_date: {
                $gte: today,
                $lt: tomorrow
            },
            balance_payout: { $gt: 0 }
        });

        for (let i = 0; i < aims.length; i++) {
            const aim = aims[i];
                
            const userId = aim.user_id;
            const transactionId = generateTransactionId();

            // Add to pending payment history
            await paymentHistory.create({
                user_id: userId,
                aim_id: aim._id,
                paid_amount: aim.calculated_emi,
                payment_type: "aim",
                paidAt: new Date(),
                transaction_id: transactionId,
                status: "paid",
            });

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                {
                $inc: { balance: -aim.calculated_emi, debit: aim.calculated_emi },
                }
            );

            const nextPayment = today;
            nextPayment.setDate(today.getDate() + 7);

            // Update next payment date to next week
            await Aim.findByIdAndUpdate(aim._id, {
                $set: { next_payment_date: nextPayment },
                $inc: {
                balance_payout: -aim.calculated_emi,
                current_saved: aim.calculated_emi,
                },
            });

            // If the balance payout amount less than equals to zero then update the status completed
            await Aim.findByIdAndUpdate(aim._id,
                { balance_payout: { $lte: 0 }, status: "active" },
                { $set: { status: "completed" } }
            );
        }
        console.log("Done creating weekly aim payments");
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}

export const aimPaymentsMonthlyScheduler = async () => {
    try {
        console.log("Start creating monthly aim payments");
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const aims = await Aim.find({
            status: "active",
            payment_cycle: "monthly",
            next_payment_date: {
                $gte: today,
                $lt: tomorrow
            },
            balance_payout: { $gt: 0 }
        });

        for (let i = 0; i < aims.length; i++) {
            const aim = aims[i];

            const userId = aim.user_id;
            const transactionId = generateTransactionId();

            // Add to pending payment history
            await paymentHistory.create({
                user_id: userId,
                aim_id: aim._id,
                paid_amount: aim.calculated_emi,
                payment_type: "aim",
                paidAt: new Date(),
                transaction_id: transactionId,
                status: "paid",
            });

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                {
                $inc: { balance: -aim.calculated_emi, debit: aim.calculated_emi },
                }
            );

            const nextPayment = today;
            nextPayment.setDate(today.getDate() + 30);

            // Update next payment date to next month
            await Aim.findByIdAndUpdate(aim._id, {
                $set: { next_payment_date: nextPayment },
                $inc: {
                balance_payout: -aim.calculated_emi,
                current_saved: aim.calculated_emi,
                },
            });

            // If the balance payout amount less than equals to zero then update the status completed
            await Aim.findByIdAndUpdate(aim._id,
                { balance_payout: { $lte: 0 }, status: "active" },
                { $set: { status: "completed" } }
            );
        }
        console.log("Done creating monthly aim payments");
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}