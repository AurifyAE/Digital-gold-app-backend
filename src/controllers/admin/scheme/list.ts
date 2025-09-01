import { Request, Response } from "express";
import Scheme from "../../../models/scheme";

export const listSchemes = async (req: Request, res: Response) => {
  const schemesWithUsers = await Scheme.aggregate([
    { $match: { is_deleted: false } },
    {
      $lookup: {
        from: "selectedschemes",
        localField: "_id",
        foreignField: "scheme_id",
        as: "selected_schemes",
      },
    },
    {
      $lookup: {
        from: "users", // users collection
        localField: "selected_schemes.user_id",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $project: {
        name: 1,
        months: 1,
        monthly_pay: 1,
        amount: 1,
        bonus: 1,
        user_count: { $size: "$users" },
        users: {
          $map: {
            input: "$users",
            as: "user",
            in: {
              first_name: "$$user.first_name",
              last_name: "$$user.last_name",
              email: "$$user.email",
              mobile_no: "$$user.mobile_no",
            },
          },
        },
      },
    },
  ]);

  res.json({
    success: true,
    message: "Schemes fetched successfully.",
    data: schemesWithUsers,
  });
};
