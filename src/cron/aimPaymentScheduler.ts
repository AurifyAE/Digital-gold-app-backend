import AppError from "../utils/error";
import Aim from "../models/aim";
import paymentHistory from "../models/paymentHistory";

export const aimPaymentsDailyScheduler = async () => {
    try {
        const aims = await Aim.find({ status: "active", payment_cycle: "daily" });

        for (let i = 0; i < aims.length; i++) {
            const aim = aims[i];

            // Add to pending payment history
            await paymentHistory.create({
                user_id: aim.user_id,
                aim_id: aim._id,
                paid_amount: aim.calculated_emi,
                payment_type: "aim",
                status: "pending"
            });
        }
    } catch (error) {
        throw new AppError(500, "Internal server error");
    }
}

export const aimPaymentsWeeklyScheduler = async () => {
    try {
        const aims = await Aim.find({
            status: "active",
            payment_cycle: "weekly",
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