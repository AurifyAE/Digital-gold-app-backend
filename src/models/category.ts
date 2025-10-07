import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    is_active: boolean;
    is_deleted: boolean;
    editable: boolean;
}

const categorySchema: Schema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        editable: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
