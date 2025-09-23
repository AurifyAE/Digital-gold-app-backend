import { Request, Response } from "express";
import Kyc from "../../../models/kyc";

export const pendingKycList = async (req: Request, res: Response) => {
    const pendingKycList = await Kyc.aggregate([
      { $match: { status: "pending" } },
      // Join User details
      {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user",
            },
      },
      { $unwind: "$user" },
      // Join Address details
      {
            $lookup: {
                from: "addresses",
                localField: "address_id",
                foreignField: "_id",
                as: "address"
            },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
      {
            $project: {
                _id: 1,
                emirates_id: 1,
                emirates_id_front_img: 1,
                emirates_id_back_img: 1,
                passport_no: 1,
                visa_copy: 1,
                status: 1,
                createdAt: 1,
                // Include user info (select fields)
                "user.first_name": 1,
                "user.last_name": 1,
                "user.email": 1,
                "user.mobile_no": 1,
                "user.date_of_birth": 1,
                "user.gender": 1,
                // Include address info if exists
                address: 1,
            },
        },
        { $sort: { createdAt: -1 } }
    ]);

    res.json({
        success: true,
        message: "Pending KYC list fetched successfully",
        data: pendingKycList,
    });
};
