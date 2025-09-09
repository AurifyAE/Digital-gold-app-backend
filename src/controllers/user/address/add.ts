import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Address from "../../../models/address";

export const addAddress = async (req: Request, res: Response) => {
    const { userId, street, district, city, state, postal_code } = req.body;
    // const userId = (req as any).user?._id;

    // Validate input
    if (!street || !district || !city || !state || !postal_code) {
        throw new AppError(400, "Please provide address details.");
    }

    // Check if address already exists
    const existingAddress = await Address.findOne({ user_id: userId });
    if (existingAddress) {
        throw new AppError(400, "Address already exists.");
    }

    // Create new address
    const address = await Address.create({
        user_id: userId,
        street,
        district,
        city,
        state,
        postal_code
    });

  res.json({
    success: true,
    message: "Aim created successfully.",
    data: address,
  });
};
