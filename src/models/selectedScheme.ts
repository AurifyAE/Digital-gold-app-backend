import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISelectedScheme extends Document {
    user_id: Types.ObjectId;
    scheme_id: Types.ObjectId;
    balance_payout: number;
    scheme_type: string;
    status: string;
    credited_gold: number;
    next_payment_date: Date
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
        next_payment_date: {
            type: Date,
            required: true
        },
        scheme_type: {
            type: String,
            required: true,
        },
        credited_gold: {
            type: Number,
            required: true,
            default: 0
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