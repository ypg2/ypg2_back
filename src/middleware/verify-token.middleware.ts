import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import HttpError from "../error/HttpError";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["access-token"]) {
    const message = "로그인 API 를 통해 access-token 을 발급 받으세요.";
    next(new HttpError(400, message));
  }

  try {
    const accessToken = req.headers["access-token"] as string;
    req.decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
      userID: number;
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const message =
        "access-token 이 만료되었습니다. 로그인 API 를 통해 재발급 받으세요.";
      next(new HttpError(401, message));
    }

    next(error);
  }

  next();
}
