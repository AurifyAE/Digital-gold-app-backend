import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Aim from "../../../models/aim";

export const addAim = async (req: Request, res: Response) => {
  const { name, months, amount, payment_date, payment_cycle, monthly_pay } = req.body;
  const userId = (req as any).user?._id;

  // Validate input
  if (!name || !months || !amount || !monthly_pay) {
    throw new AppError(
      400,
      "Please provide name, months, amount and monthly pay!"
    );
  }

  // Check if scheme already exists
  const existingScheme = await Aim.findOne({ name });
  if (existingScheme) {
    throw new AppError(400, "Scheme name already exists.");
  }

  const aimData: any = {};

  aimData.user_id = userId;
  aimData.name = name;
  aimData.months = months;
  aimData.amount = amount;
  aimData.monthly_pay = monthly_pay;

  // Dynamically only fields that are provided
  if (payment_date !== undefined && payment_date !== "")
    aimData.payment_date = payment_date;
  if (payment_cycle !== undefined && payment_cycle !== "")
    aimData.payment_cycle = payment_cycle;

  // Create new aim
  const aim = new Aim(aimData);
  await aim.save();

  res.json({
    success: true,
    message: "Aim created successfully.",
    data: aim,
  });
};
