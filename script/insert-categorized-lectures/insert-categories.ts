import { Connection, ResultSetHeader } from "mysql2/promise";
import { fakerKO as faker } from "@faker-js/faker";

export default class InsertCategories {
  static size = 10;

  static makeValues() {
    const categoryIDs = Array.from(
      { length: this.size },
      (_, index) => index + 1
    );

    return categoryIDs.map((categoryID) => [
      categoryID,
      faker.lorem.word().trim(),
    ]);
  }

  static async run(conn: Connection) {
    const query = `
      INSERT INTO categories
        (
          id,
          title
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();    
    const [result] = await conn.query<ResultSetHeader>(query, [values]);
    return result;
  }
}
