import { Request, Response } from "express";
import AppError from "../../../utils/error";
import StaticAim from "../../../models/staticAim";

export const addStaticAim = async (req: Request, res: Response) => {
    const { name, months, amount, payment_cycle } = req.body;

    // Validate input
    if (!name || !months || !amount || !payment_cycle) {
        throw new AppError(400, "Please provide name, months, amount and payment cycle.");
    }

    // Check if aim already exists
    const existingStaticAim = await StaticAim.findOne({ name });
    if (existingStaticAim) {
        throw new AppError(400, "Static Aim name already exists.");
    }

    // Create new static aim
    await StaticAim.create({
        name,
        months,
        amount,
        payment_cycle
    });
    
    res.json({
        success: true,
        message: "Static Aim created successfully.",
        data: {}
    });
}