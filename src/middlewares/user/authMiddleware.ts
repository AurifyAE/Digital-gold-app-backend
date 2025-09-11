import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user";
import Session, { ISession } from "../../models/session";

interface DecodedToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: ISession;
    }
  }
}

const JWT_USER_SECRET = process.env.JWT_USER_SECRET || "";

let userId: string | null = null;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_USER_SECRET) as DecodedToken;

    // Find session by user_id
    const user = await Session.findOne({ user_id: decoded.id });
    userId = decoded.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.log(error, "err");
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid token.",
    });
  }
};

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = await User.findOne({ _id: userId });
  if (req.user && userData && userData.role === "user") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. User privileges required.",
    });
  }
};