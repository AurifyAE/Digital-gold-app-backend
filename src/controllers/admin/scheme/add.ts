import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";

export const addScheme = async (req: Request, res: Response) => {
    const { name, months, amount, bounce } = req.body;

    // Validate input
    if (!name || !months || !amount || !bounce) {
        throw new AppError(400, "Please provide name, months, amount and bounce.");
    }

    // Check if scheme already exists
    const existingScheme = await Scheme.findOne({ name });
    if (existingScheme) {
        throw new AppError(400, "Scheme name already exists.");
    }

    // Create new scheme
    const scheme = await Scheme.create({
        name,
        months,
        amount,
        bounce
    });
    
    res.json({
        success: true,
        message: "Scheme created successfully.",
        data: scheme,
    });
};