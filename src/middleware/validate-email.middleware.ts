import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

export default async function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validation = body("email")
    .notEmpty()
    .withMessage("email 이 존재하지 않습니다.")
    .isEmail()
    .withMessage("유효하지 않은 email 형식 입니다.");

  await validation.run(req);

  next();
}
