import { Request, Response } from "express";
import PaymentHistory from "../../../models/paymentHistory";

export const listPayments = async (req: Request, res: Response) => {
  const payments = await PaymentHistory.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "selectedschemes",
        localField: "selected_scheme_id",
        foreignField: "_id",
        as: "selected_scheme",
      },
    },
    { $unwind: "$selected_scheme" },
    {
      $lookup: {
        from: "schemes",
        localField: "selected_scheme.scheme_id",
        foreignField: "_id",
        as: "scheme",
      },
    },
    { $unwind: "$scheme" },
    // Final projection for clean structure
    {
      $project: {
        _id: 1,
        paid_amount: 1,
        status: 1,
        paidAt: 1,
        // User details
        user: {
          first_name: "$user.first_name",
          last_name: "$user.last_name",
          mobile_no: "$user.mobile_no",
          email: "$user.email",
        },
        // SelectedScheme details
        selected_scheme: {
          _id: "$selected_scheme._id",
          balance_payout: "$selected_scheme.balance_payout",
          payment_date: "$selected_scheme.payment_date",
          status: "$selected_scheme.status",
        },
        // Scheme details
        scheme: {
          _id: "$scheme._id",
          name: "$scheme.name",
          months: "$scheme.months",
          amount: "$scheme.amount",
          monthly_pay: "$scheme.monthly_pay",
          bonus: "$scheme.bonus",
        },
      },
    },
  ]);

  res.json({
    success: true,
    message: "Payments fetched successfully.",
    data: payments,
  });
};
