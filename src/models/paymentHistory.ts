import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPaymentHistory extends Document {
    user_id: Types.ObjectId;
    selected_scheme_id: Types.ObjectId;
    paid_amount: number;
    paidAt: Date;
    status: string;
}

const paymentHistorySchema: Schema = new Schema<IPaymentHistory>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        selected_scheme_id: {
            type: Schema.Types.ObjectId,
            ref: "selectedscheme",
            required: true,
        },
        paid_amount: {
            type: Number,
            required: true,
        },
        paidAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            required: true,
            default: "requested"
        }
    },
  {
    timestamps: true,
  }
);

const paymentHistory = mongoose.model<IPaymentHistory>(
  "PaymentHistory",
  paymentHistorySchema
);

export default paymentHistory;