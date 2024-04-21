import { Router, Request, Response, NextFunction } from "express";
import IController from "../interface/controller.interface";
import UserService from "../service/user.service";

export default class UserController implements IController {
  path = "/users";
  router = Router();
  service = new UserService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/sign-up`, this.signUp);
    this.router.post(`${this.path}/log-in`, this.logIn);
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      await this.service.signUp(dto);

      res.json({
        message: "회원가입 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      const accessToken = await this.service.logIn(dto);

      res.header("Access-Token", accessToken);
      res.json({
        message: "로그인 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}
