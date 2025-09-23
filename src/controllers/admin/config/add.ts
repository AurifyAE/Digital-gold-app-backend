import { Request, Response } from "express";
import Config from "../../../models/config";
import AppError from "../../../utils/error";

export const addConfig = async (req: Request, res: Response) => {
  const { key, value } = req.body;

  // Validate input
  if (!key || !value) {
    throw new AppError(400, "Please provide key and value.");
  }

  // Check if config key already exists
  const findConfig = await Config.findOne({ key });
  if (findConfig) throw new AppError(400, "Config key already exists.");

  // Add config
  await Config.create({ key, value });

  res.json({
    success: true,
    message: "Config data added successfully.",
    data: {},
  });
};
