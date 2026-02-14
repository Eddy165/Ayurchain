import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .isIn(["FARMER", "PROCESSOR", "LAB", "CERTIFIER", "BRAND", "CONSUMER", "ADMIN"])
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const batchCreateValidation = [
  body("speciesName").trim().notEmpty().withMessage("Species name is required"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
  body("unit").trim().notEmpty().withMessage("Unit is required"),
  body("harvestDate").isISO8601().withMessage("Valid harvest date is required"),
  body("geoLocation.address").trim().notEmpty().withMessage("Address is required"),
  body("geoLocation.coordinates.lat").isNumeric().withMessage("Latitude must be a number"),
  body("geoLocation.coordinates.lng").isNumeric().withMessage("Longitude must be a number"),
  body("initialQualityGrade").trim().notEmpty().withMessage("Quality grade is required"),
];
