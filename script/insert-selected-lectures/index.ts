import { Connection } from "mysql2/promise";
import database from "../../src/database";
import InsertSelectedLectures from "./insert-selected-lectures";
import InsertUsers from "./insert-users";
import SelectUsersMaxID from "./select-users-max-id";

async function run(conn: Connection) {
  const [row] = await SelectUsersMaxID.run(conn);

  const users = await InsertUsers.run(conn, row.maxUserID);
  const selectedLectures = await InsertSelectedLectures.run(
    conn,
    row.maxUserID
  );

  return {
    usersRows: users.affectedRows,
    selectedLecturesRows: selectedLectures.affectedRows,
  };
}

(async function () {
  const pool = database.pool;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { usersRows, selectedLecturesRows } = await run(conn);

    console.log(
      `ypg2.users 테이블에 ${usersRows} 개의 레코드가 추가되었습니다.`
    );
    console.log(
      `ypg2.selected_lectures 테이블에 ${selectedLecturesRows} 개의 레코드가 추가되었습니다.`
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();

    console.error(error);
  } finally {
    await pool.end();
  }
})();
