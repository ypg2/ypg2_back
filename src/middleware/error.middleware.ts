import { Request, Response, NextFunction } from "express";
import HttpError from "../error/HttpError";

export default function errorMiddleware(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "서버 내부에서 에러가 발생했습니다.";

  res.status(status).json({
    message,
  });
}
