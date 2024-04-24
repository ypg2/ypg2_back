import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";

export default async function validateGetLectures(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validations = [
    query("categoryID")
      .optional()
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage("유효하지 않은 categoryID 형식 입니다.")
      .customSanitizer((value) => Number(value)),
    query("limit")
      .optional()
      .isInt({ allow_leading_zeroes: false })
      .withMessage("유효하지 않은 limit 형식 입니다.")
      .customSanitizer((value) => Number(value)),
    query("page")
      .optional()
      .isInt({ allow_leading_zeroes: false })
      .withMessage("유효하지 않은 page 형식 입니다.")
      .customSanitizer((value) => Number(value)),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
}
