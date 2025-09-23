import mongoose, { Document, Schema } from "mongoose";

export interface IConfig extends Document {
    key: string;
    value: any;
    is_active: boolean;
    is_deleted: boolean;
}

const configSchema: Schema = new Schema<IConfig>(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Config = mongoose.model<IConfig>("Config", configSchema);
export default Config;
