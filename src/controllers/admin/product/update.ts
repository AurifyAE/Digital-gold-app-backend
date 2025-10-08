import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Product from "../../../models/product";

interface S3File extends Express.Multer.File {
    location: string;
}

export const updateProduct = async (req: Request, res: Response) => {
    const {
        id,
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

    if (!id) throw new AppError(400, "Please provide product id!");
    
    // Check if product exists
    const findProduct = await Product.findById(id);
    if (!findProduct) throw new AppError(400, "Product not found.");

    // Check if product title exists
    const findProductTitle = await Product.findOne({ title });
    if (findProductTitle) throw new AppError(400, `Product title ${findProductTitle.title} already exists.`);

    const productData: any = {};

    const addIfValid = (key: string, value: any) => {
        if (value !== undefined && value !== "") productData[key] = value;
    };

    addIfValid("title", title);
    addIfValid("description", description);
    addIfValid("category", category);
    addIfValid("material", material);
    addIfValid("metal_purity", metal_purity);
    addIfValid("metal_color", metal_color);
    addIfValid("gold_weight_grams", gold_weight_grams);
    addIfValid("finish", finish);
    addIfValid("dimensions_mm", dimensionsObj);

    if (image)
        productData.image = image;

    if (Object.keys(productData).length === 0)
        throw new AppError(400, "Please provide at least one field to update.");

    // Update product
    await Product.findByIdAndUpdate(id, productData, { new: true });
    
    res.json({
        status: true,
        message: "Product updated successfully.",
        data: {}
    });
}