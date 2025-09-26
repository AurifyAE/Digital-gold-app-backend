import { Request, Response } from "express";
import StaticAim from "../../../models/staticAim";
import AppError from "../../../utils/error";

export const deleteStaticAim = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        throw new AppError(400, "Please provide static aim id.");
    }

    // Check if static aim exists
    const findStaticAim = await StaticAim.findById(id);
    if (!findStaticAim) throw new AppError(400, "Static Aim not found.");

    // Delete static aim
    await StaticAim.findByIdAndUpdate(id, { is_deleted: true });

    res.json({
        success: true,
        message: "Static Aim deleted successfully.",
        data: {},
    });
};