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
          is_deleted: false, // optional: exclude deleted user
        },
      },
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
                $expr: { $eq: ["$selected_scheme_id", "$$selectedSchemeId"] },
              },
            },
            {
              $project: {
                paid_amount: 1,
                paidAt: 1,
                remarks: 1,
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
      message: "User details fetched successfully.",
      data: userDetails,
    });
}