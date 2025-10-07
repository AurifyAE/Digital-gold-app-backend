import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Product from "../../../models/product";

interface S3File extends Express.Multer.File {
    location: string;
}

export const addProduct = async (req: Request, res: Response) => {
    const {
        title,
        description,
        category,
        material,
        metal_purity,
        metal_color,
        gold_weight_grams,
        finish,
        dimensions_mm
    } = req.body;

    const image = (req.file as S3File)?.location;

    // Convert string to valid JSON string
    const jsonString = dimensions_mm.replace(/(\w+):/g, '"$1":');
    // Parse to object
    const dimensionsObj = JSON.parse(jsonString);

    if (
        !title ||
        !description ||
        !category ||
        !image ||
        !material ||
        !metal_purity ||
        !metal_color ||
        !gold_weight_grams ||
        !finish ||
        !dimensionsObj.length ||
        !dimensionsObj.width ||
        !dimensionsObj.thickness
    )
    throw new AppError(400, "Please provide all required product details!");
    
    // Check if product title exists
    const existingTitle = await Product.findOne({ title });
    if (existingTitle) throw new AppError(400, `Product title ${existingTitle.title} already exists.`);

    const product = await Product.create(
        {
            title,
            description,
            category,
            image,
            material,
            metal_purity,
            metal_color,
            gold_weight_grams,
            finish,
            dimensions_mm: dimensionsObj
        });
    
    res.json({
        success: true,
        message: "Product added successfully.",
        data: product
    });
};
