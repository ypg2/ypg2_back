import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

export default async function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validations = [
    body("email")
      .notEmpty()
      .withMessage("email 이 존재하지 않습니다.")
      .isEmail()
      .withMessage("유효하지 않은 email 형식 입니다."),
    body("username")
      .notEmpty()
      .withMessage("username 이 존재하지 않습니다.")
      .isString()
      .withMessage("유효하지 않은 username 형식 입니다."),
    body("password")
      .notEmpty()
      .withMessage("password 가 존재하지 않습니다.")
      .isString()
      .withMessage("유효하지 않은 password 형식 입니다."),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
}
