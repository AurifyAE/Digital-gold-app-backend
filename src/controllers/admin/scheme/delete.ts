import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Scheme from "../../../models/scheme";

export const deleteScheme = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        throw new AppError(400, "Please provide scheme id.");
    }

    // Check if scheme exists
    const findScheme = await Scheme.findById(id);
    if (!findScheme) {
        throw new AppError(400, "Scheme not found.");
    }

    // Delete scheme
    await Scheme.findByIdAndUpdate({ _id: id }, { is_deleted: true });

    res.json({
        success: true,
        message: "Scheme deleted successfully.",
        data: {}
    });
};