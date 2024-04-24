import { RowDataPacket } from "mysql2";
import database from "../database";

export default class CategoryRepository {
  database = database;

  async selectCategories() {
    const pool = this.database.pool;
    const query = `
      SELECT
        id AS categoryID,
        title AS categoryTitle
      FROM
        categories;
    `;

    const [result] = await pool.query<RowDataPacket[]>(query);
    return result;
  }
}
