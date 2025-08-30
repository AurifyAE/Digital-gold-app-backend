import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISession extends Document {
  user_id: Types.ObjectId;
  token: string;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema<ISession>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
