import { Request, Response } from "express";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const deleteUser = async (req: Request, res: Response) => {
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

    // Delete user
    await User.findByIdAndUpdate({ _id: id }, { is_deleted: true });

    res.json({
        success: true,
        message: "User deleted successfully.",
        data: {}
    });
}