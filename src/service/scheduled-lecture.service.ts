import IScheduledLectureDTO from "../dto/scheduled-lecture.dto";
import ISelectedLectureDTO from "../dto/selected-lecture.dto";
import HttpError from "../error/HttpError";
import ScheduledLectureRepository from "../repository/scheduled-lecture.repository";
import SelectedLectureRepository from "../repository/selected-lecture.repository";

export default class ScheduledLectureService {
  repository = new ScheduledLectureRepository();

  async getLectures(userID: number) {
    const rows = await this.repository.selectLectures(userID);

    if (!rows.length) {
      const message = "강의 시간표가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return {
      meta: { size: rows.length },
      data: rows,
    };
  }

  async postLecture(dto: IScheduledLectureDTO) {
    const [row] = await this.repository.selectSchedule(dto);

    if (row) {
      const message = `요청하신 요일 (${row.weekDay}) 은 이미 등록된 강의 시간 (${row.startAt} ~ ${row.endAt}) 과 겹칩니다.`;
      throw new HttpError(409, message);
    }

    const selectedLectureRepository = new SelectedLectureRepository();
    await Promise.allSettled([
      selectedLectureRepository.deleteLecture(dto),
      this.repository.insertLecture(dto),
    ]);
  }

  async putLecture(dto: IScheduledLectureDTO) {
    const [row] = await this.repository.selectSchedule(dto);

    if (row) {
      const message = `요청하신 요일 (${row.weekDay}) 은 이미 등록된 강의 시간 (${row.startAt} ~ ${row.endAt}) 과 겹칩니다.`;
      throw new HttpError(409, message);
    }

    await this.repository.updateLecture(dto);
  }

  async deleteLecture(dto: ISelectedLectureDTO) {
    const [row] = await this.repository.selectLecture(dto);

    if (!row) {
      const message = "삭제할 강의 시간이 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    await this.repository.deleteLecture(dto);
  }
}
