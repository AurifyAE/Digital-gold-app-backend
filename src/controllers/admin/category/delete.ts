import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Category from "../../../models/category";

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate input
    if (!id) throw new AppError(400, "Please provide category id.");

    // Check if category exists
    const findCategory = await Category.findById(id);
    if (!findCategory) throw new AppError(400, "Category not found.");

    // Delete category
    await Category.findByIdAndUpdate(id, { is_deleted: true });

    res.json({
        success: true,
        message: "Category deleted successfully.",
        data: {}
    });
}