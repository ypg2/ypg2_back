import { ResultSetHeader, RowDataPacket } from "mysql2";
import IScheduledLectureDTO from "../dto/scheduled-lecture.dto";
import ISelectedLectureDTO from "../dto/selected-lecture.dto";
import database from "../database";

export default class ScheduledLectureRepository {
  database = database;

  async selectLectures(userID: number) {
    const pool = this.database.pool;
    const query = `
      SELECT
        l.id AS lectureID,
        l.title AS title,
        sch.week_day_id AS weekDayID,
        sch.start_at AS startAt,
        sch.end_at AS endAt
      FROM
        scheduled_lectures AS sch
      LEFT JOIN
        lectures AS l
        ON sch.lecture_id = l.id
      WHERE
        sch.user_id = ?
      ORDER BY
        sch.week_day_id,
        sch.start_at,
        sch.end_at;
    `;

    const values = [userID];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async selectSchedule(dao: IScheduledLectureDTO) {
    const pool = this.database.pool;
    const query = `
      SELECT
        sch.week_day_id AS weekDayID,
        w.week_day AS weekDay,
        sch.start_at AS startAt,
        sch.end_at AS endAt
      FROM
        scheduled_lectures AS sch
      LEFT JOIN
        week_days AS w
        ON sch.week_day_id = w.id
      WHERE
        sch.week_day_id = ?
        AND NOT (sch.end_at <= ? OR sch.start_at >= ?);
    `;

    const values = [dao.weekDayID, dao.startAt, dao.endAt];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async selectLecture(dao: ISelectedLectureDTO) {
    const pool = this.database.pool;
    const query = `
      SELECT
        *
      FROM
        scheduled_lectures
      WHERE
        user_id = ?
        AND lecture_id = ?;
    `;

    const values = [dao.userID, dao.lectureID];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async insertLecture(dao: IScheduledLectureDTO) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO scheduled_lectures
        (
          user_id,
          lecture_id,
          week_day_id,
          start_at,
          end_at
        )
      VALUES
        (?, ?, ?, ?, ?);
    `;

    const values = [
      dao.userID,
      dao.lectureID,
      dao.weekDayID,
      dao.startAt,
      dao.endAt,
    ];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }

  async updateLecture(dao: IScheduledLectureDTO) {
    const pool = this.database.pool;
    const query = `
      UPDATE
        scheduled_lectures
      SET
        week_day_id = ?,
        start_at = ?,
        end_at = ?
      WHERE
        user_id = ?
        AND lecture_id = ?;
    `;

    const values = [
      dao.weekDayID,
      dao.startAt,
      dao.endAt,
      dao.userID,
      dao.lectureID,
    ];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }

  async deleteLecture(dao: ISelectedLectureDTO) {
    const pool = this.database.pool;
    const query = `
      DELETE
      FROM
        scheduled_lectures
      WHERE
        user_id = ?
        AND lecture_id = ?;
    `;

    const values = [dao.userID, dao.lectureID];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }
}
