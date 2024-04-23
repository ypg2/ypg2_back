import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export default function validateError(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({
      errors: errors.array(),
    });
  }

  next();
}
