import { Request, Response } from "express";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const updateUser = async (req: Request, res: Response) => {
    const { id, status } = req.body;

    // Validate input
    if (!id || !status) {
        throw new AppError(400, "Please provide user id and status!");
    }

    let is_active = false;
    if (status === "active") {
        is_active = true;
    }

    // Update user
    await User.findByIdAndUpdate({ _id: id }, { is_active });

    res.json({
        success: true,
        message: "User status updated successfully.",
        data: {}
    });
 }