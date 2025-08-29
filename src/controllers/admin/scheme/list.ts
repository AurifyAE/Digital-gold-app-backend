import { Request, Response } from "express";
import Scheme from "../../../models/scheme";

export const listSchemes = async (req: Request, res: Response) => {
    const schemes = await Scheme.find({ is_deleted: false });

    res.json({
        success: true,
        message: "Schemes fetched successfully.",
        data: schemes
    });
};