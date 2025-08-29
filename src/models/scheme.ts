import mongoose, { Document, Schema } from "mongoose";

export interface IScheme extends Document {
  name: string;
  months: number;
  amount: number;
  bounce: number;
}

const schemeSchema = new Schema<IScheme>(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        months:
        {
            type: Number,
            required: true
        },
        amount:
        {
            type: Number,
            required: true
        },
        bounce:
        {
            type: Number,
            required: true
        },
  },
  {
    timestamps: true,
  }
);

const Scheme = mongoose.model<IScheme>("Scheme", schemeSchema);

export default Scheme;
