import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Category from "../../../models/category";

export const updateCategory = async (req: Request, res: Response) => {
    const { id, name } = req.body;

    // Validate input
    if (!id || !name) throw new AppError(400, "Please provide category id and name.");

    // Check if category exists
    const findCategory = await Category.findById(id);
    if (!findCategory) throw new AppError(400, "Category not found.");

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) throw new AppError(400, `Category name ${existingCategory.name} already exists.`);

    findCategory.name = name;
    await findCategory.save();
    
    res.json({
        success: true,
        message: "Category updated successfully",
        data: {}
    });
}