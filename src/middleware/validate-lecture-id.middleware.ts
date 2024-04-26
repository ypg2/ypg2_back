import { Request, Response, NextFunction } from "express";
import { param } from "express-validator";

export default async function validateLectureID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validation = param("lectureID")
    .notEmpty()
    .withMessage("lectureID 가 존재하지 않습니다.")
    .isInt({ gt: 0, allow_leading_zeroes: false })
    .withMessage("유효하지 않은 lectureID 형식 입니다.")
    .customSanitizer((value) => Number(value));

  await validation.run(req);

  next();
}
