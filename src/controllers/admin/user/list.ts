import { Request, Response } from "express";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "user" })
            .select("_id first_name last_name mobile_no email is_active is_deleted createdAt");

        res.json({
            success: true,
            message: "Users fetched successfully.",
            data: users
        });
    } catch (error) {
        throw new AppError(500, "Internal server error.");
    }
};