import { Request, Response } from "express";
import AppError from "../utils/error";
import User from "../models/user";
import Wallet from "../models/wallet";
import Session from "../models/session";
import { createUserToken } from "../utils/createToken";

// Register controller
export const register = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    mobile_no,
    email,
    password,
  } = req.body;

  // Validate input
  if (
    !first_name ||
    !last_name ||
    !mobile_no ||
    !date_of_birth ||
    !gender ||
    !email ||
    !password
  ) {
    throw new AppError(
      400,
      "Please provide first name, last name, date of birth, gender, mobile number, email and password."
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(400, "User already exists.");
  }

  // Create new user
  const user = await User.create({
    first_name,
    last_name,
    date_of_birth,
    gender,
    mobile_no,
    email,
    password,
  });

  // Create wallet
  const wallet = await Wallet.create({
    user_id: user._id
  });

  res.json({
    success: true,
    message: "User created successfully.",
    data: {
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        mobile_no: user.mobile_no,
        email: user.email,
        role: user.role,
        wallet: {
          balance: wallet.balance
        }
      },
    },
  });
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new AppError(400, "Please provide email and password.");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(401, "Invalid credentials.");
  }

  // Generate token using the utility function
  const token = createUserToken({
    id: user._id.toString(),
    role: user.role,
  });

  // Create session
  await Session.create({
    user_id: user._id,
    token,
  });

  res.json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    throw new AppError(400, "Please provide user id.");
  }

  // Delete session
  await Session.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Logout successful.",
    data: {},
  });
};
