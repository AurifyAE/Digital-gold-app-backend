import { Request, Response } from "express";
import AppError from "../../../utils/error";
import User from "../../../models/user";
import SelectedScheme from "../../../models/selectedScheme";
import PaymentHistory from "../../../models/paymentHistory";

export const listUsers = async (req: Request, res: Response) => {
  const usersWithSchemesAndPayments = await User.aggregate([
    { $match: { role: "user", is_deleted: false } },
    {
      $project: {
        first_name: 1,
        last_name: 1,
        mobile_no: 1,
        email: 1,
        is_active: 1,
        is_deleted: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "selectedschemes",
        localField: "_id",
        foreignField: "user_id",
        as: "selected_schemes",
      },
    },
    {
      $unwind: {
        path: "$selected_schemes",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "schemes",
        localField: "selected_schemes.scheme_id",
        foreignField: "_id",
        as: "selected_schemes.scheme",
      },
    },
    {
      $unwind: {
        path: "$selected_schemes.scheme",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "paymenthistories",
        let: { selectedSchemeId: "$selected_schemes._id" },
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
              user_id: 1,
              selected_scheme_id: 1,
            },
          },
        ],
        as: "selected_schemes.payment_history",
      },
    },
    {
      $group: {
        _id: "$_id",
        first_name: { $first: "$first_name" },
        last_name: { $first: "$last_name" },
        mobile_no: { $first: "$mobile_no" },
        email: { $first: "$email" },
        is_active: { $first: "$is_active" },
        is_deleted: { $first: "$is_deleted" },
        createdAt: { $first: "$createdAt" },
        selected_schemes: { $push: "$selected_schemes" },
      },
    },
    {
      $project: {
        selected_schemes: {
          $filter: {
            input: "$selected_schemes",
            as: "scheme",
            cond: { $ne: ["$$scheme", null] },
          },
        },
        first_name: 1,
        last_name: 1,
        mobile_no: 1,
        email: 1,
        is_active: 1,
        is_deleted: 1,
        createdAt: 1,
      },
    },
  ]);

  res.json({
    success: true,
    message: "Users fetched successfully.",
    data: usersWithSchemesAndPayments,
  });
};
