import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Category from "../../../models/category";

export const addCategory = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) throw new AppError(400, "Please provide category name.");

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) throw new AppError(400, `Category name ${existingCategory.name} already exists.`);

    const category = await Category.create({ name });

    res.json({
        success: true,
        message: "Category added successfully",
        data: category
    });
};