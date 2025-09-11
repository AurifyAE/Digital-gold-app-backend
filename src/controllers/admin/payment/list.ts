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
        pipeline: [
          {
            $project: {
              first_name: 1,
              last_name: 1,
              mobile_no: 1,
              email: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        transaction_id: 1,
        paid_amount: 1,
        status: 1,
        paidAt: 1,
        payment_type: 1,
        user: 1,
      },
    },
  ]);

  res.json({
    success: true,
    message: "Payments fetched successfully.",
    data: payments,
  });
};
