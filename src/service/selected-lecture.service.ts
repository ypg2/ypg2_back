import ISelectedLectureDTO from "../dto/selected-lecture.dto";
import HttpError from "../error/HttpError";
import SelectedLectureRepository from "../repository/selected-lecture.repository";

export default class SelectedLectureService {
  repository = new SelectedLectureRepository();

  async getLectures(userID: number) {
    const rows = await this.repository.selectLectures(userID);

    if (!rows.length) {
      const message = "선택된 강의가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return {
      meta: { size: rows.length },
      data: rows,
    };
  }

  async postLecture(dto: ISelectedLectureDTO) {
    const [row] = await this.repository.selectLecture(dto);

    if (row) {
      const message = "이미 강의가 선택 되었습니다.";
      throw new HttpError(409, message);
    }

    await this.repository.insertLecture(dto);
  }

  async deleteLecture(dto: ISelectedLectureDTO) {
    const [row] = await this.repository.selectLecture(dto);

    if (!row) {
      const message = "이미 강의가 선택 취소 되었습니다.";
      throw new HttpError(404, message);
    }

    await this.repository.deleteLecture(dto);
  }
}
