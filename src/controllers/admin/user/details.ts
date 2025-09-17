import { Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const detailsUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        throw new AppError(400, "Please provide user id.");
    }

    // Check if user exists
    const findUser = await User.findById(id);
    if (!findUser) {
        throw new AppError(400, "User not found.");
    }
  
    const userId = new mongoose.Types.ObjectId(id);
    
    const userDetails = await User.aggregate([
      {
        $match: {
          _id: userId,
          role: "user",
          is_deleted: false,
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          date_of_birth: 1,
          gender: 1,
          mobile_no: 1,
          email: 1,
          is_active: 1,
          is_deleted: 1,
          createdAt: 1,
        },
      },
      // --- Get selected schemes with schemeDetails and payment history ---
      {
        $lookup: {
          from: "selectedschemes",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user_id", "$$userId"] } } },
            {
              $lookup: {
                from: "schemes",
                localField: "scheme_id",
                foreignField: "_id",
                as: "scheme",
              },
            },
            { $unwind: { path: "$scheme", preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: "paymenthistories",
                let: { selectedSchemeId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$selected_scheme_id", "$$selectedSchemeId"],
                      },
                    },
                  },
                  {
                    $project: {
                      paid_amount: 1,
                      paidAt: 1,
                      remarks: 1,
                      user_id: 1,
                      selected_scheme_id: 1,
                      status: 1,
                    },
                  },
                ],
                as: "payment_history",
              },
            },
          ],
          as: "selected_schemes",
        },
      },
      // --- Get aims with payment history ---
      {
        $lookup: {
          from: "aims",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user_id", "$$userId"] } } },
            {
              $lookup: {
                from: "paymenthistories",
                let: { aimId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$aim_id", "$$aimId"] } } },
                  {
                    $project: {
                      paid_amount: 1,
                      paidAt: 1,
                      remarks: 1,
                      user_id: 1,
                      aim_id: 1,
                      status: 1,
                    },
                  },
                ],
                as: "payment_history",
              },
            },
          ],
          as: "aims",
        },
      },
      // --- Get user wallet ---
      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "user_id",
          as: "wallet"
        }
      },
      // Flatten wallet array to single wallet object
      {
        $addFields: {
          wallet: { $arrayElemAt: ["$wallet", 0] }
        }
      },
      // Lookup payment history (assuming each wallet has unique _id)
      {
        $lookup: {
          from: "paymenthistories",
          let: { walletId: "$wallet._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$wallet_id", "$$walletId"] }
              }
            },
            {
              $project: {
                paid_amount: 1,
                paidAt: 1,
                remarks: 1,
                user_id: 1,
                wallet_id: 1,
                status: 1
              }
            }
          ],
          as: "wallet_payment_history"
        }
      },
      // Embed payment history into wallet object (if desired)
      {
        $addFields: {
          "wallet.payment_history": "$wallet_payment_history"
        }
      },
      // Optionally: remove 'wallet_payment_history' flat field
      {
        $project: {
          wallet_payment_history: 0
        }
      },
      // --- Final projection ---
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          date_of_birth: 1,
          gender: 1,
          mobile_no: 1,
          email: 1,
          is_active: 1,
          is_deleted: 1,
          createdAt: 1,
          selected_schemes: 1,
          aims: 1,
          wallet: 1,
        },
      },
    ]);
  
    res.json({
      success: true,
      message: "User details fetched successfully.",
      data: userDetails,
    });
}