import { Connection, RowDataPacket } from "mysql2/promise";

export default class SelectUsersMaxID {
  static async run(conn: Connection) {
    const query = `
      SELECT
        MAX(id) AS maxUserID
      FROM
        users;
    `;

    const [result] = await conn.query<RowDataPacket[]>(query);
    return result;
  }
}
