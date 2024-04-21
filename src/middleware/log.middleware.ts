import { Request, Response, NextFunction } from "express";

export default function logMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let log = [`${req.method} on ${req.url}`];

  switch (req.method) {
    case "POST": {
      req.body && log.push(`with ${JSON.stringify(req.body)}`);
    }
  }

  console.log(log.join(" "));
  next();
}