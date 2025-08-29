import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";

export const updateScheme = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { months, amount, bounce } = req.body;

    // Validate input
    if (!id) {
        throw new AppError(400, "Please provide scheme id.");
    }

    // Check if scheme exists
    const findScheme = await Scheme.findById(id);
    if (!findScheme) {
        throw new AppError(400, "Scheme not found.");
    }

    const updateScheme: any = {};

    // Validate and add months if provided
    if (months !== undefined && months !== null && months !== "")
        updateScheme.months = Number(months);

    // Validate and add amount if provided
    if (amount !== undefined && amount !== null && amount !== "")
        updateScheme.amount = Number(amount);

    // Validate and add bounce if provided
    if (bounce !== undefined && bounce !== null && bounce !== "")
        updateScheme.bounce = Number(bounce);

    if (Object.keys(updateScheme).length === 0)
        throw new AppError(400, "Please provide at least one field to update.");

    // Update scheme
    const scheme = await Scheme.findByIdAndUpdate(id, updateScheme, {
        new: true,
    });

  res.json({
    success: true,
    message: "Scheme updated successfully.",
    data: scheme,
  });
};
