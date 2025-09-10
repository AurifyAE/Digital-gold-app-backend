import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPaymentHistory extends Document {
    user_id: Types.ObjectId;
    selected_scheme_id: Types.ObjectId;
    aim_id: Types.ObjectId;
    payment_type: string;
    paid_amount: number;
    paidAt: Date;
    status: string;
    transaction_id: string;
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
            ref: "Selectedscheme",
            required: function () { return this.payment_type === "scheme"; },
        },
        aim_id: {
            type: Schema.Types.ObjectId,
            ref: "Aim",
            required: function () { return this.payment_type === "aim"; },
        },
        payment_type: {
            type: String,
            enum: ["scheme", "aim", "wallet"],
            required: true,
        },
        paid_amount: {
            type: Number,
            required: true,
        },
        paidAt: {
            type: Date,
            required: true,
            default: null
        },
        status: {
            type: String,
            required: true,
            default: "requested"
        },
        transaction_id: {
            type: String,
            unique: true,
            default: null
        }
    },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentHistorySchema.index({ user_id: 1, payment_type: 1 });
paymentHistorySchema.index({ selected_scheme_id: 1 });
paymentHistorySchema.index({ aim_id: 1 });
paymentHistorySchema.index({ status: 1, paidAt: 1 });

const paymentHistory = mongoose.model<IPaymentHistory>(
  "PaymentHistory",
  paymentHistorySchema
);

export default paymentHistory;