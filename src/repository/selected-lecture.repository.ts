import { ResultSetHeader, RowDataPacket } from "mysql2";
import database from "../database";
import ISelectedLectureDTO from "../dto/selected-lecture.dto";

export default class SelectedLectureRepository {
  database = database;

  async selectLectures(userID: number) {
    const pool = this.database.pool;
    const query = `
    SELECT
      sel.selected_lecture_id AS selectedLectureID,
      l.id AS lectureID,
      l.title AS title
    FROM
      selected_lectures AS sel
    LEFT JOIN
      lectures AS l
      ON sel.lecture_id = l.id
    WHERE
      sel.user_id = ?;
    `;

    const values = [userID];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async selectLecture(dao: ISelectedLectureDTO) {
    const pool = this.database.pool;
    const query = `
      SELECT
        *
      FROM 
        selected_lectures
      WHERE
        user_id = ?
        AND lecture_id = ?;
    `;

    const values = [dao.userID, dao.lectureID];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async insertLecture(dao: ISelectedLectureDTO) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO selected_lectures
        (
          user_id,
          lecture_id
        )
      VALUES
        (?, ?);
    `;

    const values = [dao.userID, dao.lectureID];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }

  async deleteLecture(dao: ISelectedLectureDTO) {
    const pool = this.database.pool;
    const query = `
      DELETE
      FROM
        selected_lectures
      WHERE
        user_id = ?
        AND lecture_id = ?;
    `;

    const values = [dao.userID, dao.lectureID];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }
}
