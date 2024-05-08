import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

export default async function validateScheduledLectureBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validations = [
    body("weekDayID")
      .notEmpty()
      .withMessage("weekDayID 가 존재하지 않습니다.")
      .isInt({ min: 1, max: 7, allow_leading_zeroes: false })
      .withMessage(
        "유효하지 않은 weekDayID 형식 입니다. cf. 월(1), 화(2), 수(3), 목(4), 금(5), 토(6), 일(7)"
      ),
    body("startAt")
      .notEmpty()
      .withMessage("startAt 이 존재하지 않습니다.")
      .matches(/^(([01]?[0-9]|2[0-3]):(?:00|30))|24:00$/)
      .withMessage("유효하지 않은 startAt 형식 입니다."),
    body("endAt")
      .notEmpty()
      .withMessage("endAt 이 존재하지 않습니다.")
      .custom((value) => value > req.body.startAt)
      .withMessage("startAt 보다 이전 시간 입니다.")
      .matches(/^(([01]?[0-9]|2[0-3]):(?:00|30))|24:00$/)
      .withMessage("유효하지 않은 endAt 형식 입니다."),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
}
