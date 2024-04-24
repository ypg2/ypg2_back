import ILectureDTO from "../dto/lecture.dto";
import HttpError from "../error/HttpError";
import LectureRepository from "../repository/lecture.repository";

export default class LectureService {
  repository = new LectureRepository();

  async getLectures(dto: ILectureDTO) {
    const offset = dto.limit * (dto.page - 1);

    const dao = { ...dto, offset };
    const rows = await this.repository.selectLectures(dao);

    if (!rows.length) {
      const message = "강의가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return {
      meta: { size: rows.length },
      data: rows,
    };
  }
}