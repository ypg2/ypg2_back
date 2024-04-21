import { ResultSetHeader, RowDataPacket } from "mysql2";
import IUserDto from "../dto/user.dto";
import database from "../database";

export default class UserRepository {
  database = database;

  async selectUser(email: string) {
    const pool = this.database.pool;
    const query = `
      SELECT
        id AS userID,
        salt,
        hashed_password AS hashedPassword
      FROM
        users
      WHERE
        email = ?;
    `;

    const values = [email];
    const [result] = await pool.query<RowDataPacket[]>(query, values);
    return result;
  }

  async insertUser(dao: IUserDto & { salt: string; hashedPassword: string }) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO users
        (
          email,
          username,
          salt,
          hashed_password
        )
      VALUES
        (?, ?, ?, ?);
    `;

    const values = [dao.email, dao.username, dao.salt, dao.hashedPassword];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result;
  }
}
