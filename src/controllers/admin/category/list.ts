import { Request, Response } from "express";
import Category from "../../../models/category";

export const listCategory = async (req: Request, res: Response) => {
    const categories = await Category.find({ is_deleted: false }).sort({ createdAt: -1 });
    
    res.json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
    });
};