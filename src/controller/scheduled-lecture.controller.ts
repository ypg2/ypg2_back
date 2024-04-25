import { Router, Request, Response, NextFunction } from "express";
import IController from "../type/controller";
import validateError from "../middleware/validate-error.middleware";
import validateScheduledLecture from "../middleware/validate-scheduled-lecture.middleware";
import verifyToken from "../middleware/verify-token.middleware";
import ScheduledLectureService from "../service/scheduled-lecture.service";

export default class ScheduledLectureController implements IController {
  path = "/scheduled-lectures";
  router = Router();
  service = new ScheduledLectureService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(`${this.path}`, verifyToken, this.getLectures);
    this.router.post(
      `${this.path}/:selectedLectureID`,
      verifyToken,
      validateScheduledLecture,
      validateError,
      this.postLecture
    );
    this.router.put(
      `${this.path}/:selectedLectureID/:scheduledLectureID`,
      verifyToken,
      validateScheduledLecture,
      validateError,
      this.putLecture
    );
    this.router.delete(
      `${this.path}/:selectedLectureID/:scheduledLectureID`,
      verifyToken,
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
      const { selectedLectureID } = req.params;
      const { weekDayID, startAt, endAt } = req.body;

      const dto = {
        selectedLectureID: selectedLectureID as unknown as number,
        weekDayID,
        startAt,
        endAt,
      };
      await this.service.postLecture(dto);

      res.json({
        message: "강의 시간이 등록 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  putLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { selectedLectureID, scheduledLectureID } = req.params;
      const { weekDayID, startAt, endAt } = req.body;

      const dto = {
        selectedLectureID: selectedLectureID as unknown as number,
        scheduledLectureID: scheduledLectureID as unknown as number,
        weekDayID,
        startAt,
        endAt,
      };
      await this.service.putLecture(dto);

      res.json({
        message: "강의 시간이 수정 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { scheduledLectureID } = req.params;
      await this.service.deleteLecture(scheduledLectureID as unknown as number);

      res.json({
        message: "강의 시간이 삭제 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}
