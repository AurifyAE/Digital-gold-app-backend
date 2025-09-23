import { Request, Response } from "express";
import Config from "../../../models/config";
import AppError from "../../../utils/error";

export const updateConfig = async (req: Request, res: Response) => {
    const { id, key, value } = req.body;

    // Validate input
    if (!id) throw new AppError(400, "Please provide config id.");

    // Check if config exists
    const findConfig = await Config.findById(id);
    if (!findConfig) throw new AppError(400, "Config not found.");

    const data: any = {};
    
    // Validate and add key if provided
    if (key !== undefined && key !== "") {
        const lowerCaseKey = key.toLowerCase();
        
        const findConfig = await Config.findOne({ lowerCaseKey });
        if (findConfig) throw new AppError(400, "Updated config key already exists.");

        data.key = lowerCaseKey;
    }

    // Validate and add value if provided
    if (value !== undefined && value !== "") data.value = value;

    if (Object.keys(data).length === 0)
        throw new AppError(400, "Please provide at least one field to update.");

    // Update config
    await Config.findByIdAndUpdate(id, data, {new: true });

    res.json({
        success: true,
        message: "Config data updated successfully.",
        data: {}
    });
}