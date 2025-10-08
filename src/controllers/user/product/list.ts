import { Request, Response } from "express";
import Product from "../../../models/product";

export const listProduct = async (req: Request, res: Response) => {
    const {
        category_id,
        title,
        material,
        metal_purity,
        metal_color,
        finish,
        offset = 0,
        limit = 10,
    } = req.query;

    // Base condition — active & not deleted
    const filter: any = {
        is_active: true,
        is_deleted: false
    };

    // Apply filters/search only if provided
    if (category_id) filter.category = category_id;
    if (material) filter.material = material;
    if (metal_purity) filter.metal_purity = metal_purity;
    if (metal_color) filter.metal_color = metal_color;
    if (finish) filter.finish = finish;

    // Search by title (case-insensitive)
    if (title) filter.title = { $regex: title as string, $options: "i" };

    // Fetch paginated products
    const [products, totalCount] = await Promise.all([
        Product.find(filter)
            .populate({ path: "category_id", select: "name" })
            .sort({ createdAt: -1 })
            .skip(Number(offset))
            .limit(Number(limit)),

        Product.countDocuments(filter)
    ]);

    res.json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        pagination: {
            total: totalCount,
            offset: Number(offset),
            limit: Number(limit),
            hasMore: totalCount > Number(offset) + Number(limit)
        }
    });
};