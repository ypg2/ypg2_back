import { Connection, ResultSetHeader } from "mysql2/promise";
import InsertLectures from "../insert-categorized-lectures/insert-lectures";
import InsertUsers from "./insert-users";

export default class InsertSelectedLectures {
  static makeValues(maxUserID: number) {
    const userIDs = Array.from(
      { length: InsertUsers.size },
      (_, index) => index + 1 + maxUserID
    );
    const lectureIDs = Array.from(
      { length: InsertLectures.size },
      (_, index) => index + 1
    );

    return userIDs.flatMap((userID) =>
      lectureIDs.map((lectureID) => [userID, lectureID])
    );
  }

  static async run(conn: Connection, maxUserID: number) {
    const query = `
      INSERT INTO selected_lectures
        (          
          user_id,
          lecture_id
        )
      VALUES
        ?;
    `;

    const values = this.makeValues(maxUserID);
    const [result] = await conn.query<ResultSetHeader>(query, [values]);
    return result;
  }
}
