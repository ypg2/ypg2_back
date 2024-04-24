import { Connection, ResultSetHeader } from "mysql2/promise";
import { fakerKO as faker } from "@faker-js/faker";

export default class InsertLectures {
  static size = 100;

  static makeValues() {
    const lectureIDs = Array.from(
      { length: this.size },
      (_, index) => index + 1
    );

    return lectureIDs.map((lectureID) => [
      lectureID,
      `https://picsum.photos/id/${lectureID}`,
      faker.lorem.word(),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.lorem.paragraph(),
    ]);
  }

  static async run(conn: Connection) {
    const query = `
      INSERT INTO lectures
        (
          id,
          img_url,
          title,
          lecturer,
          introduction
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query<ResultSetHeader>(query, [values]);
    return result;
  }
}
