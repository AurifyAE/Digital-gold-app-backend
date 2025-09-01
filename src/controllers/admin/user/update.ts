import { Request, Response } from "express";
import bcrypt from "bcrypt";
import AppError from "../../../utils/error";
import User from "../../../models/user";

export const updateDetailsUser = async (req: Request, res: Response) => {
  const { id, first_name, last_name, mobile_no, email, password } = req.body;

  // Validate input
  if (!id) {
    throw new AppError(400, "Please provide user id!");
  }

  // Build dynamic update object
  const updateData: any = {};
  if (first_name !== undefined && first_name !== "")
    updateData.first_name = first_name;
  if (last_name !== undefined && last_name !== "")
    updateData.last_name = last_name;
  if (mobile_no !== undefined && mobile_no !== "")
    updateData.mobile_no = mobile_no;
  if (email !== undefined && email !== "")
    updateData.email = email;
  if (password !== undefined && password !== "") {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateData.password = hashedPassword;
  }

  // Handle case where nothing is provided to update
  if (Object.keys(updateData).length === 0)
    throw new AppError(400, "No fields provided to update.");

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "User details updated successfully.",
    data: updatedUser,
  });
};

export const blockOrActiveUser = async (req: Request, res: Response) => {
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
    data: {},
  });
};
