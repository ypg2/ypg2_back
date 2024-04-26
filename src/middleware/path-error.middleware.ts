import { Request, Response } from "express";

export default function pathErrorMiddleware(req: Request, res: Response) {
  res.status(404);
  res.json({
    message: `요청하신 path (${req.path}) 가 존재하지 않습니다.`,
  });
}
