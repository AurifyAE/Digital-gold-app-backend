import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISelectedScheme extends Document {
    user_id: Types.ObjectId;
    scheme_id: Types.ObjectId;
    balance_payout: number;
    payment_date: number;
    status: string;
}

const selectedSchemeSchema: Schema = new Schema<ISelectedScheme>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        scheme_id: {
            type: Schema.Types.ObjectId,
            ref: "Scheme",
            required: true,
        },
        balance_payout: {
            type: Number,
            required: true,
        },
        payment_date: {
            type: Number,
            required: true,
            min: 1,
            max: 30
        },
        status: {
            type: String,
            required: true,
            default: "active"
        }
    },
  {
    timestamps: true,
  }
);

const SelectedScheme = mongoose.model<ISelectedScheme>(
  "SelectedScheme",
  selectedSchemeSchema
);

export default SelectedScheme;