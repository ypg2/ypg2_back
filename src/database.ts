import mysql, { PoolOptions } from "mysql2/promise";

class Database {
  private options: PoolOptions = {
    host:
      process.env.NODE_ENV?.trim() === "production"
        ? "localhost"
        : process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "ypg2",
  };

  readonly pool;

  constructor() {
    this.pool = mysql.createPool(this.options);
  }

  connect() {
    this.pool
      .query("SELECT 1;")
      .then(() => console.log("Connected on 3306"))
      .catch((error) => console.error(error));
  }
}

export default new Database();
