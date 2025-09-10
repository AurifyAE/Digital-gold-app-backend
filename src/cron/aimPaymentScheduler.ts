import AppError from "../utils/error";
import Aim from "../models/aim";
import paymentHistory from "../models/paymentHistory";
import Wallet from "../models/wallet";

export const aimPaymentsDailyScheduler = async () => {
    try {
        const today = new Date();
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

            // Add to pending payment history
            await paymentHistory.create({
                user_id: aim.user_id,
                aim_id: aim._id,
                paid_amount: aim.calculated_emi,
                payment_type: "aim",
                status: "paid"
            });

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                { $inc: { balance: - aim.calculated_emi } }
            );

            // Update next payment date to tomorrow
            await Aim.findByIdAndUpdate(aim._id, {
                $set: { next_payment_date: new Date(today.getDate() + 7) },
                $inc: {
                    balance_payout: - aim.calculated_emi,
                    current_saved: aim.calculated_emi,
                }
            });
        }
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}

export const aimPaymentsWeeklyScheduler = async () => {
    try {
        const today = new Date();
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

            // Add to pending payment history
            await paymentHistory.create({
            user_id: aim.user_id,
            aim_id: aim._id,
            paid_amount: aim.calculated_emi,
            payment_type: "aim",
            status: "paid",
            });

            // Deduct amount from wallet
            await Wallet.findOneAndUpdate(
                { user_id: userId },
                { $inc: { balance: - aim.calculated_emi } }
            );

            // Update next payment date to tomorrow
            await Aim.findByIdAndUpdate(aim._id, {
              $set: { next_payment_date: new Date(today.getDate() + 7) },
              $inc: {
                balance_payout: - aim.calculated_emi,
                current_saved: aim.calculated_emi
              },
            });
        }
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}

export const aimPaymentsMonthlyScheduler = async () => {
    try {
        const aims = await Aim.find({
            status: "active",
            payment_cycle: "monthly",
        });

        for (let i = 0; i < aims.length; i++) {
            const aim = aims[i];

            // Add to pending payment history
            await paymentHistory.create({
            user_id: aim.user_id,
            aim_id: aim._id,
            paid_amount: aim.calculated_emi,
            payment_type: "aim",
            status: "pending",
            });
        }
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}