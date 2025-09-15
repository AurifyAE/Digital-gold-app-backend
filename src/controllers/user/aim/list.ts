import { Request, Response } from "express";
import Aim from "../../../models/aim";

export const listAims = async (req: Request, res: Response) => {
    const userId = (req as any).user?.user_id;

    const result = await Aim.find({ user_id: userId }).sort({ createdAt: -1 });

    res.json({
        success: true,
        message: "Aim fetched successfully.",
        data: result
    });
}