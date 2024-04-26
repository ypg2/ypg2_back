import { Router, Request, Response, NextFunction } from "express";
import ILectureDTO from "../dto/lecture.dto";
import IController from "../type/controller";
import validateGetLectures from "../middleware/validate-get-lectures.middleware";
import validateError from "../middleware/validate-error.middleware";
import LectureService from "../service/lecture.service";

export default class LectureController implements IController {
  path = "/lectures";
  router = Router();
  service = new LectureService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      `${this.path}`,
      validateGetLectures,
      validateError,
      this.getLectures
    );
    this.router.get(`${this.path}/:lectureID`, this.getLecture);
  }

  getLectures = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.query as unknown as ILectureDTO;
      const { meta, data } = await this.service.getLectures(dto);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureID } = req.params;
      const data = await this.service.getLectrue(
        lectureID as unknown as number
      );

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
