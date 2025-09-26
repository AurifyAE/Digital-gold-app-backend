import { Request, Response } from "express";
import StaticAim from "../../../models/staticAim";

export const listStaticAim = async (req: Request, res: Response) => {
    const staticAims = await StaticAim.find({ is_deleted: false });

    res.json({
        success: true,
        message: "Static Aims fetched successfully.",
        data: staticAims
    });
};