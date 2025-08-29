import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  is_deleted: boolean;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      masLength: [20, "First name must be less than 20 characters"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      masLength: [20, "Last name must be less than 20 characters"],
      trim: true,
    },
    mobile_no: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      masLength: [50, "Email must be less than 50 characters"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      default: "user",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// export default mongoose.model<IUser>("User", userSchema);
const User = mongoose.model<IUser>("User", userSchema);
export default User;