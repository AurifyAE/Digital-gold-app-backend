import { Request, Response } from "express";
import User from "../../../models/user";

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?.user_id;

    if (!userId)
        return res.status(401).json({ success: false, message: "User not authenticated" });

    const profile = await User.aggregate([
        { $match: { _id: userId } },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id", 
                    foreignField: "user_id",
                    as: "address"
                }
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "wallet"
                }
            },
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    date_of_birth: 1,
                    gender: 1,
                    email: 1,
                    mobile_no: 1,
                    address: 1,
                    wallet: 1,
                    createdAt: 1
                }
            }
        ]);
    
    res.json({
        success: true,
        message: "Address fetched successfully.",
        data: profile
    });
};