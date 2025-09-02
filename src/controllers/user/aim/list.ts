import { Request, Response } from "express";
import Aim from "../../../models/aim";

export const listAims = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    const result = await Aim.find({ user_id: userId });

    res.json({
        success: true,
        message: "Aim fetched successfully.",
        data: result
    });
}