import { Request, Response } from "express";
import Scheme from "../../../models/scheme";

export const listSchemes = async (req: Request, res: Response) => {
    const schemes = await Scheme.find({ is_active: true, is_deleted: false })
        .select("_id name months monthly_pay amount bonus")
        .sort({ createdAt: -1 });;

    res.json({
        success: true,
        message: "Schemes fetched successfully.",
        data: schemes
    });
};