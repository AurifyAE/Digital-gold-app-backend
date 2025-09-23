import { Request, Response } from "express";
import Config from "../../../models/config";
import AppError from "../../../utils/error";
import { setUsdToAedGoldRate } from "../../../utils/aedRateCache";

export const getAedGoldRate = async (req: Request, res: Response) => {
    const result = await Config.findOne({ key: "usd_to_aed_gold_rate" });

    res.json({
        success: true,
        message: "AED gold rate fetched successfully.",
        data: result
    });
}

// export const updateAedGoldRate = async (req: Request, res: Response) => {
//     const { id, value } = req.body;

//     // Validate input
//     if (!id || !value) throw new AppError(400, "Please provide config id and value.");

//     // Update config
//     await Config.findByIdAndUpdate(id, { value });

//     // Update usd to aed gold rate
//     setUsdToAedGoldRate(value);

//     res.json({
//         success: true,
//         message: "AED gold rate updated successfully.",
//         data: {},
//     });
// };