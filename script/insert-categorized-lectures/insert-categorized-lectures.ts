import { Connection, ResultSetHeader } from "mysql2/promise";
import InsertCategories from "./insert-categories";
import InsertLectures from "./insert-lectures";

export default class InsertCategorizedLectures {
  static makeValues() {
    const categoryIDs = Array.from(
      { length: InsertCategories.size },
      (_, index) => index + 1
    );
    const lectureIDs = Array.from(
      { length: InsertLectures.size },
      (_, index) => index + 1
    );

    return categoryIDs.flatMap((categoryID) =>
      lectureIDs.map((lectureID) => [categoryID, lectureID])
    );
  }

  static async run(conn: Connection) {
    const query = `
      INSERT INTO categorized_lectures
        (
          category_id,
          lecture_id
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query<ResultSetHeader>(query, [values]);
    return result;
  }
}
