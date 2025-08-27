import { Request, Response } from "express";
import AppError from "../utils/error";
import User from "../models/user";
import { createUserToken } from "../utils/createToken";

// Register controller
export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, mobile_no, email, password } = req.body;

  // Validate input
  if (!first_name || !last_name || !mobile_no || !email || !password) {
    throw new AppError(
      400,
      "Please provide first name, last name, mobile number, email and password."
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
    mobile_no,
    email,
    password,
  });

  res.json({
    success: true,
    message: "User created successfully.",
    data: {
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
        role: user.role_id,
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
    role: user.role_id,
  });

  res.json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
        role: user.role_id,
      },
      token,
    },
  });
};
