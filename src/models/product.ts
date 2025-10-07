import mongoose, { Document, Schema, Types } from "mongoose";

interface Dimensions {
    length: number;
    width: number;
    thickness: number;
}

export interface IProduct extends Document {
    title: string;
    description: string;
    category: Types.ObjectId;
    image: string;
    material: string;
    metal_purity: string;
    metal_color: string;
    gold_weight_grams: number;
    finish: string;
    dimensions_mm: Dimensions;
    is_active: boolean;
    is_deleted: boolean;
}

const dimensionsSchema: Schema = new Schema<Dimensions>(
    {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        thickness: { type: Number, required: true },
    },
    { _id: false }
);

const productSchema: Schema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        image: { type: String, required: true },
        material: { type: String, required: true },
        metal_purity: { type: String, required: true },
        metal_color: { type: String, required: true },
        gold_weight_grams: { type: Number, required: true },
        finish: { type: String, required: true },
        dimensions_mm: { type: dimensionsSchema, required: true },
        is_active: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
