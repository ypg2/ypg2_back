import { Connection } from "mysql2/promise";
import InsertCategories from "./insert-categories";
import InsertCategorizedLectures from "./insert-categorized-lectures";
import InsertLectures from "./insert-lectures";
import database from "../../src/database";

async function run(conn: Connection) {
  const [categories, lectures] = await Promise.all([
    InsertCategories.run(conn),
    InsertLectures.run(conn),
  ]);

  const categorizedLectures = await InsertCategorizedLectures.run(conn);

  return {
    categoriesRows: categories.affectedRows,
    lecturesRows: lectures.affectedRows,
    categorizedLecturesRows: categorizedLectures.affectedRows,
  };
}

(async function () {
  const pool = database.pool;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { categoriesRows, lecturesRows, categorizedLecturesRows } = await run(
      conn
    );

    console.log(
      `ypg2.categories 테이블에 ${categoriesRows} 개의 레코드가 추가되었습니다.`
    );
    console.log(
      `ypg2.lectures 테이블에 ${lecturesRows} 개의 레코드가 추가되었습니다.`
    );
    console.log(
      `ypg2.categorized_lectures 테이블에 ${categorizedLecturesRows} 개의 레코드가 추가되었습니다.`
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();

    console.error(error);
  } finally {
    await pool.end();
  }
})();
