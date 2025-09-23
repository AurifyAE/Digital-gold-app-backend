import mongoose, { Document, Schema } from "mongoose";

export interface IConfig extends Document {
    key: string;
    value: any;
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
    },
    {
        timestamps: true,
    }
);

const Config = mongoose.model<IConfig>("Config", configSchema);
export default Config;
