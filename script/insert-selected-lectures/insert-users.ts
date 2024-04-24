import { Connection, ResultSetHeader } from "mysql2/promise";
import { fakerKO as faker } from "@faker-js/faker";

export default class InsertUsers {
  static size = 10;

  static makeValues(maxUserID: number) {
    const userIDs = Array.from(
      { length: this.size },
      (_, index) => index + 1 + maxUserID
    );

    return userIDs.map((userID) => [
      userID,
      faker.internet.email(),
      faker.internet.userName(),
      faker.internet.password({ length: 24 }),
      faker.internet.password({ length: 24 }),
    ]);
  }

  static async run(conn: Connection, maxUserID: number) {
    const query = `
      INSERT INTO users
        (
          id,
          email,
          username,
          salt,
          hashed_password
        )
      VALUES
        ?;
    `;

    const values = this.makeValues(maxUserID);
    const [result] = await conn.query<ResultSetHeader>(query, [values]);
    return result;
  }
}
