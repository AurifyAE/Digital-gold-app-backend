import { Request, Response } from "express";
import Product from "../../../models/product";

export const listProduct = async (req: Request, res: Response) => {

    const products = await Product.find({ is_deleted: false })
        .populate({
            path: "category_id",
            select: "name"
        })
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        message: "Products fetched successfully",
        data: products
    });
};