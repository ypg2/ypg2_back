import { RowDataPacket } from "mysql2";
import ILectureDTO from "../dto/lecture.dto";
import database from "../database";

export default class LectureRepository {
  database = database;

  async selectLectures(dao: ILectureDTO & { offset: number }) {
    const pool = this.database.pool;
    let query = `
      SELECT
        l.id AS lectureID,
        l.img_url AS imgURL,
        l.title,
        l.lecturer,
        l.introduction
      FROM
        lectures AS l
    `;

    let values = [];

    if (dao.categoryID) {
      query += `
        LEFT JOIN
          categorized_lectures AS cl
          ON l.id = cl.lecture_id
        WHERE
          cl.category_id = ?
      `;
      values.push(dao.categoryID);
    }

    if (dao.limit && !isNaN(dao.offset)) {
      query += "LIMIT ? OFFSET ?";
      values.push(dao.limit, dao.offset);
    }

    query += ";";

    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }
}
