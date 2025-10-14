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
  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .isString()
    .withMessage("Name must be a string"),
  body("district")
    .notEmpty()
    .withMessage("District is required")
    .isString()
    .withMessage("District must be a string"),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string"),
  body("postal_code")
    .notEmpty()
    .withMessage("Postal code is required")
    .isNumeric()
    .withMessage("Postal code must be a number"),
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

export const validateUpdateAddress = [
  body("street")
    .isString()
    .withMessage("Name must be a string"),
  body("district")
    .isString()
    .withMessage("District must be a string"),
  body("city")
    .isString()
    .withMessage("City must be a string"),
  body("state")
    .isString()
    .withMessage("State must be a string"),
  body("postal_code")
    .isNumeric()
    .withMessage("Postal code must be a number"),
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