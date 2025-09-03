import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAimScheme extends Document {
  user_id: Types.ObjectId;
  name: string;
  months: number;
  amount: number;
  payment_date: number;
  balance_payout: number;
  payment_cycle: string;
  calculated_emi: number;
  current_saved: number;
  status: string;
}

const aimSchema: Schema = new Schema<IAimScheme>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    payment_date: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 1,
    },
    balance_payout: {
      type: Number,
      required: true,
      default: 0,
    },
    payment_cycle: {
      type: String,
      required: true,
      default: "monthly",
    },
    calculated_emi: {
      type: Number,
      required: true,
    },
    current_saved: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Aim = mongoose.model<IAimScheme>("Aim", aimSchema);
export default Aim;
