import mongoose, { Document, Schema } from "mongoose";

export interface IScheme extends Document {
  name: string;
  months: number;
  monthly_pay: number;
  amount: number;
  bonus: number;
  editable: boolean;
  is_active: boolean;
  is_deleted: boolean;
}

const schemeSchema = new Schema<IScheme>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    months: {
      type: Number,
      required: true,
    },
    monthly_pay: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
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

const Scheme = mongoose.model<IScheme>("Scheme", schemeSchema);

export default Scheme;
