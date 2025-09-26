import { Request, Response } from "express";
import AppError from "../../../utils/error";
import StaticAim from "../../../models/staticAim";

export const updateStaticAim = async (req: Request, res: Response) => {
    const { id, name, months, amount, payment_cycle } = req.body;

    if(!id) throw new AppError(400, "Please provide static aim id.");

    // Check if static aim exists
    const findStaticAim = await StaticAim.findById(id);
    if (!findStaticAim) {
        throw new AppError(400, "Static Aim not found.");
    }

    const data: any = {};

    // Validate and add name if provided
    if (name !== undefined && name !== "") {
        const findStaticAim = await StaticAim.findOne({ name });
        if (findStaticAim) throw new AppError(400, "Updated static aim name already exists.");

        data.name = name;
    }

    // Validate and add months if provided
    if (months !== undefined && months !== "") data.months = months;

    // Validate and add amount if provided
    if (amount !== undefined && amount !== "") data.amount = amount;

    // Validate and add payment cycle if provided
    if (payment_cycle !== undefined && payment_cycle !== "") data.payment_cycle = payment_cycle;

    if (Object.keys(data).length === 0) throw new AppError(400, "Please provide at least one field to update.");

    // Update static aim
    const updatedStaticAim = await StaticAim.findByIdAndUpdate(id, data, {
        new: true,
    });

    res.json({
        success: true,
        message: "Static Aim updated successfully.",
        data: updatedStaticAim,
    });
};