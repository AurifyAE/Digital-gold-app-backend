import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_USER_SECRET = process.env.JWT_USER_SECRET || "";
const JWT_USER_EXPIRE = process.env.JWT_USER_EXPIRE || "1d";

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || "";
const JWT_ADMIN_EXPIRE = process.env.JWT_ADMIN_EXPIRE || "2d";

interface TokenPayload {
  id: string;
  role: string;
}

export const createUserToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_USER_SECRET, {
    expiresIn: JWT_USER_EXPIRE as jwt.SignOptions["expiresIn"],
  });
};

export const createAdminToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_ADMIN_SECRET, {
    expiresIn: JWT_ADMIN_EXPIRE as jwt.SignOptions["expiresIn"],
  });
};