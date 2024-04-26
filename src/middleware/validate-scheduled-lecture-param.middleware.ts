import { Request, Response, NextFunction } from "express";
import { param } from "express-validator";

export default async function validateScheduledLectureParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validations = [
    param("selectedLectureID")
      .notEmpty()
      .withMessage("selectedLectureID 가 존재하지 않습니다.")
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage("유효하지 않은 selectedLectureID 형식 입니다.")
      .customSanitizer((value) => Number(value)),
    param("scheduledLectureID")
      .optional()    
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage("유효하지 않은 scheduledLectureID 형식 입니다.")
      .customSanitizer((value) => Number(value)),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
}
