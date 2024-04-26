import { Router, Request, Response, NextFunction } from "express";
import IController from "../type/controller";
import validateError from "../middleware/validate-error.middleware";
import validateLogIn from "../middleware/validate-log-in.middleware";
import validateSignUp from "../middleware/validate-sign-up.middleware";
import UserService from "../service/user.service";

export default class UserController implements IController {
  path = "/users";
  router = Router();
  service = new UserService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      `${this.path}/sign-up`,
      validateSignUp,
      validateError,
      this.signUp
    );
    this.router.post(
      `${this.path}/log-in`,
      validateLogIn,
      validateError,
      this.logIn
    );
    this.router.post(`${this.path}/reset-password`, this.postResetPassword);
    this.router.put(
      `${this.path}/reset-password`,
      validateLogIn,
      validateError,
      this.putResetPassword
    );
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

      res.header("Authorization", accessToken);
      res.json({
        message: "로그인 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  postResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      await this.service.postResetPassword(email);

      res.json({
        message: "비밀번호 초기화가 요청 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  putResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = req.body;
      await this.service.putResetPassword(dto);

      res.json({
        message: "비밀번호 초기화 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}
