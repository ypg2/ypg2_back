import { Router, Request, Response, NextFunction } from "express";
import IController from "../type/controller";
import validateError from "../middleware/validate-error.middleware";
import validateSelectedLecture from "../middleware/validate-selected-lecture.middleware";
import verifyToken from "../middleware/verify-token.middleware";
import SelectedLectureService from "../service/selected-lecture.service";

export default class SelectedLectureController implements IController {
  path = "/selected-lectures";
  router = Router();
  service = new SelectedLectureService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(`${this.path}`, verifyToken, this.getLectures);
    this.router.post(
      `${this.path}/:lectureID`,
      verifyToken,
      validateSelectedLecture,
      validateError,
      this.postLecture
    );
    this.router.delete(
      `${this.path}/:lectureID`,
      verifyToken,
      validateSelectedLecture,
      validateError,
      this.deleteLecture
    );
  }

  getLectures = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.decodedToken!;

      const { meta, data } = await this.service.getLectures(userID);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  postLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.decodedToken!;
      const { lectureID } = req.params;

      await this.service.postLecture({
        userID,
        lectureID: lectureID as unknown as number,
      });

      res.json({
        message: "강의가 선택 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.decodedToken!;
      const { lectureID } = req.params;

      await this.service.deleteLecture({
        userID,
        lectureID: lectureID as unknown as number,
      });

      res.json({
        message: "강의가 선택 취소 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}
