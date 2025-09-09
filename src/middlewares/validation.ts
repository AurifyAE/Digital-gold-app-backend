import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("date_of_birth").notEmpty().withMessage("Date of birth is required"),
  body("gender").notEmpty().withMessage("Gender is required"),
  body("mobile_no").notEmpty().withMessage("Mobile number is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateScheme = [
  body("name").notEmpty().withMessage("Name is required"),
  body("monthly_pay").notEmpty().withMessage("Monthly pay is required"),
  body("months").notEmpty().withMessage("Months is required"),
  body("amount").notEmpty().withMessage("amount is required"),
  body("bonus").notEmpty().withMessage("Bounce is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateAim = [
  body("name").notEmpty().withMessage("Name is required"),
  body("months").notEmpty().withMessage("Months is required"),
  body("amount").notEmpty().withMessage("Amount is required"),
  body("calculated_emi").notEmpty().withMessage("Calculated emi is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateAddress = [
  body("street").notEmpty().withMessage("Street is required"),
  body("district").notEmpty().withMessage("District is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("postal_code").notEmpty().withMessage("Postal code is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }
    next();
  },
];
