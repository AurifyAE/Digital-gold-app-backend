import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Product from "../../../models/product";

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate input
    if (!id) throw new AppError(400, "Please provide product id.");

    // Check if product exists
    const findProduct = await Product.findById(id);
    if (!findProduct) throw new AppError(400, "Product not found.");

    // Delete Product
    await Product.findByIdAndUpdate(id, { is_deleted: true });

    res.json({
        success: true,
        message: "Product deleted successfully.",
        data: {}
    });
}
