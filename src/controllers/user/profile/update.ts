import { Request, Response } from "express";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const updateDetails = async (req: Request, res: Response) => {
    const { first_name, last_name, date_of_birth, gender, mobile_no, email } = req.body;
    const userId = (req as any).user?.user_id;

    const user = await User.findById(userId);

    if (!user) throw new AppError(400, "User not found!");

    const userDetails: any = {}

    if (first_name !== undefined && first_name !== "") userDetails.first_name = first_name;
    if (last_name !== undefined && last_name !== "") userDetails.last_name = last_name;
    if (date_of_birth !== undefined && date_of_birth !== "") userDetails.date_of_birth = date_of_birth;
    if (gender !== undefined && gender !== "") userDetails.gender = gender;
    if (mobile_no !== undefined && mobile_no !== "") userDetails.mobile_no = mobile_no;
    if (email !== undefined && email !== "") userDetails.email = email;

    await User.findByIdAndUpdate(userId, userDetails, { new: true });

    res.json({
        success: true,
        message: "User details updated successfully.",
        data: {}
    });
}