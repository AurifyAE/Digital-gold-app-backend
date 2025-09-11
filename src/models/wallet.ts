import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWalletScheme extends Document {
  user_id: Types.ObjectId;
  balance: number;
}

const walletSchema: Schema = new Schema<IWalletScheme>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
  },
  {
    timestamps: true,
  }
);

const wallet = mongoose.model<IWalletScheme>("Wallet", walletSchema);

export default wallet;
