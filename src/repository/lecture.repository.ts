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

  async selectLecturesCount(categoryID: number) {
    const pool = this.database.pool;
    let query = `
      SELECT
        COUNT(l.id) AS totalSize
      FROM
        lectures AS l
    `;

    let values = [];

    if (categoryID) {
      query += `
        LEFT JOIN
          categorized_lectures AS cl
          ON l.id = cl.lecture_id
        WHERE
          cl.category_id = ?
      `;
      values.push(categoryID);
    }

    query += ";";

    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async selectLecture(lectureID: number) {
    const pool = this.database.pool;
    const query = `
      SELECT
        l.id AS lectureID,
        l.img_url AS imgURL,
        l.title,
        l.lecturer,
        l.introduction,
        JSON_ARRAYAGG(c.title) AS categories
      FROM
        lectures AS l
      LEFT JOIN
        categorized_lectures AS cl
        ON l.id = cl.lecture_id
      LEFT JOIN
        categories AS c
        ON cl.category_id = c.id
      WHERE
        l.id = ?
      GROUP BY
        l.id;
    `;

    const values = [lectureID];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }
}
