import { Request, Response } from "express";
import User from "../../../models/user";

export const getTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user?.user_id;
    
    const result = await User.aggregate([
      // Match specific user
      {
        $match: {
          _id: userId,
        },
      },
      // Lookup selected schemes with scheme details and payments
      {
        $lookup: {
          from: "selectedschemes",
          localField: "_id",
          foreignField: "user_id",
          pipeline: [
            // Get scheme details for each selected scheme
            {
              $lookup: {
                from: "schemes",
                localField: "scheme_id",
                foreignField: "_id",
                as: "schemeDetails",
              },
            },
            { $unwind: "$schemeDetails" },

            // Get payment history for this selected scheme
            {
              $lookup: {
                from: "paymenthistories",
                localField: "_id",
                foreignField: "selected_scheme_id",
                pipeline: [
                  {
                    $match: {
                      payment_type: "scheme",
                    },
                  },
                  {
                    $sort: { createdAt: -1 },
                  },
                ],
                as: "paymentHistory",
              },
            },
            // Calculate total paid for this scheme
            {
              $addFields: {
                totalPaid: {
                  $sum: {
                    $map: {
                      input: "$paymentHistory",
                      as: "payment",
                      in: {
                        $cond: [
                          { $eq: ["$$payment.status", "paid"] },
                          "$$payment.paid_amount",
                          0,
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
          as: "selectedSchemes",
        },
      },
      // Lookup user aims with payment history
      {
        $lookup: {
          from: "aims",
          localField: "_id",
          foreignField: "user_id",
          pipeline: [
            // Get payment history for each aim
            {
              $lookup: {
                from: "paymenthistories",
                localField: "_id",
                foreignField: "aim_id",
                pipeline: [
                  {
                    $match: {
                      payment_type: "aim",
                    },
                  },
                  {
                    $sort: { createdAt: -1 },
                  },
                ],
                as: "paymentHistory",
              },
            },
            // Calculate total paid for this aim
            {
              $addFields: {
                totalPaid: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$paymentHistory",
                          as: "payment",
                          cond: { $eq: ["$$payment.status", "paid"] },
                        },
                      },
                      as: "p",
                      in: "$$p.paid_amount",
                    },
                  },
                },
              },
            },
          ],
          as: "aims",
        },
      },
      // Lookup wallet with payment history
      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "user_id",
          pipeline: [
            {
              $lookup: {
                from: "paymenthistories",
                localField: "user_id",
                foreignField: "user_id",
                pipeline: [
                  { $match: { payment_type: "wallet" } },
                  { $sort: { createdAt: -1 } },
                ],
                as: "paymentHistory",
              },
            },
            {
              $addFields: {
                totalPaid: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$paymentHistory",
                          as: "payment",
                          cond: { $eq: ["$$payment.status", "accepted"] },
                        },
                      },
                      as: "p",
                      in: "$$p.paid_amount",
                    },
                  },
                },
              },
            },
          ],
          as: "wallet",
        },
      },
      // Final projection
      {
        $project: {
          selectedSchemes: {
            $map: {
              input: "$selectedSchemes",
              as: "scheme",
              in: {
                selectedSchemeId: "$$scheme._id",
                selectedSchemeDetails: {
                  balance_payout: "$$scheme.balance_payout",
                  payment_date: "$$scheme.payment_date",
                  status: "$$scheme.status",
                  createdAt: "$$scheme.createdAt",
                },
                schemeDetails: "$$scheme.schemeDetails",
                paymentHistory: "$$scheme.paymentHistory",
                totalPaid: "$$scheme.totalPaid",
              },
            },
          },
          aims: {
            $map: {
              input: "$aims",
              as: "aim",
              in: {
                aimId: "$$aim._id",
                aimDetails: {
                  aim_name: "$$aim.name",
                  target_amount: "$$aim.amount",
                  months: "$$aim.months",
                  payment_cycle: "$$aim.payment_cycle",
                  emi_amount: "$$aim.calculated_emi",
                  current_saved: "$$aim.current_saved",
                  next_payment_date: "$$aim.next_payment_date",
                  status: "$$aim.status",
                  createdAt: "$$aim.createdAt",
                },
                paymentHistory: "$$aim.paymentHistory",
                totalPaid: "$$aim.totalPaid",
              },
            },
          },
          wallet: {
            $map: {
              input: "$wallet",
              as: "w",
              in: {
                balance: "$$w.balance",
                debit: "$$w.debit",
                credit: "$$w.credit",
                createdAt: "$$w.createdAt",
                paymentHistory: "$$w.paymentHistory",
                totalPaid: "$$w.totalPaid",
              },
            },
          },
        },
      },
    ]);

  res.json({
    success: true,
    message: "transaction details fetched successfully.",
    data: result,
  });
};
