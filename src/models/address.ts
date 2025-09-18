import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
  user_id: Types.ObjectId;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postal_code: number;
  is_deleted: boolean;
}

const addressSchema: Schema = new Schema<IAddress>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    street: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country : {
      type: String,
      required: true
    },
    postal_code: {
      type: Number,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const address = mongoose.model<IAddress>("Address", addressSchema);
export default address;
