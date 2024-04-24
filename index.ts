import App from "./src/app";
import database from "./src/database";
import CategoryController from "./src/controller/cateogry.controller";
import LectureController from "./src/controller/lecture.controller";
import UserController from "./src/controller/user.controller";

const app = new App([
  new CategoryController(),
  new LectureController(),
  new UserController(),
]);

app.listen();
database.connect();
