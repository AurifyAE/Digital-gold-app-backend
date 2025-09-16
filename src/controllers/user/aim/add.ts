import { Request, Response } from "express";
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  addMonths,
  format
} from "date-fns";
import AppError from "../../../utils/error";
import Aim from "../../../models/aim";

export const aimCalculation = async (req: Request, res: Response) => {
  const { months, amount, payment_cycle } = req.body;

  // Validate input
  if (!months || !amount || !payment_cycle)
    throw new AppError(
      400,
      "Please provide months, target amount and payment cycle!"
    );

  const start = new Date();
  const end = addMonths(start, months);

  let totalPayments: number = 0;

  const endDate = format(end, "yyyy-MM-dd");

  switch (payment_cycle) {
    case "daily":
      totalPayments = differenceInDays(end, start);
      break;
    case "weekly":
      totalPayments = differenceInWeeks(end, start);
      break;
    case "monthly":
      totalPayments = differenceInMonths(end, start);
      break;
    default:
      throw new AppError(400, "Invalid payment cycle!");
  }

  // Calculate EMI and total amount
  const calculatedEmi = Math.ceil(amount / totalPayments);
  const totalAmount = calculatedEmi * totalPayments;

  res.json({
    success: true,
    message: "Aim calculated successfully.",
    data: {
      totalPayments,
      calculatedEmi,
      totalAmount,
      endDate,
    },
  });
}

export const addAim = async (req: Request, res: Response) => {
  const { name, months, amount, payment_cycle, calculated_emi } = req.body;
  const userId = (req as any).user?.user_id;

  // Validate input
  if (!name || !months || !amount || !calculated_emi || !payment_cycle) {
    throw new AppError(
      400,
      "Please provide name, months, amount monthly pay and payment cycle!"
    );
  }

  // Check if scheme already exists
  const existingScheme = await Aim.findOne({ user_id: userId, name: name });
  if (existingScheme) throw new AppError(400, "Scheme name already exists.");

  const aimData: any = {};

  aimData.user_id = userId;
  aimData.name = name;
  aimData.months = months;
  aimData.amount = amount;
  aimData.payment_cycle = payment_cycle;
  aimData.calculated_emi = calculated_emi;

  // Payment cycle with calculate next payment date
  const nextPayment = new Date();

  switch (payment_cycle) {
    case "daily":
      aimData.next_payment_date = nextPayment.setDate(nextPayment.getDate() + 1);
      break;
    case "weekly":
      aimData.next_payment_date = nextPayment.setDate(nextPayment.getDate() + 7);
      break;
    case "monthly":
      aimData.next_payment_date = nextPayment.setDate(nextPayment.getDate() + 30);
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
