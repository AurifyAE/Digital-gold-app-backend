import mongoose, { Document, Schema } from "mongoose";

export interface IStaticAim extends Document {
    name: string;
    months: number;
    amount: number;
    payment_cycle: string;
    is_active: boolean;
    is_deleted: boolean
}

const staticAimSchema: Schema = new Schema<IStaticAim>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        months: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        payment_cycle: {
            type: String,
            required: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const StaticAim = mongoose.model<IStaticAim>("StaticAim", staticAimSchema);
export default StaticAim;
