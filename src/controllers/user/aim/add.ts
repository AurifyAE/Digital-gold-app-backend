import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Aim from "../../../models/aim";

export const addAim = async (req: Request, res: Response) => {
  const { name, months, amount, payment_date, payment_cycle, calculated_emi } = req.body;
  const userId = (req as any).user?._id;

  // Validate input
  if (!name || !months || !amount || !calculated_emi || !payment_cycle) {
    throw new AppError(
      400,
      "Please provide name, months, amount monthly pay and payment cycle!"
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
  aimData.calculated_emi = calculated_emi;

  // Dynamically only fields that are provided
  if (payment_date !== undefined && payment_date !== "")
    aimData.payment_date = payment_date;

  // Payment cycle with calculate next payment date
  const today = new Date();

  switch (payment_cycle) {
    case "daily":
      aimData.next_payment_date = new Date(today.getDate() + 1);
      break;
    case "weekly":
      aimData.next_payment_date = new Date(today.setDate(today.getDate() + 7));
      break;
    case "monthly":
      aimData.next_payment_date = new Date(today.setMonth(today.getMonth() + 30));
      break;
    default:
      break;
  }

  // Create new aim
  const aim = new Aim(aimData);
  await aim.save();

  res.json({
    success: true,
    message: "Aim created successfully.",
    data: aim,
  });
};
