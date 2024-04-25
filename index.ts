import App from "./src/app";
import database from "./src/database";
import CategoryController from "./src/controller/cateogry.controller";
import LectureController from "./src/controller/lecture.controller";
import ScheduledLectureController from "./src/controller/scheduled-lecture.controller";
import SelectedLectureController from "./src/controller/selected-lecture.controller";
import UserController from "./src/controller/user.controller";

const app = new App([
  new CategoryController(),
  new LectureController(),
  new ScheduledLectureController(),
  new SelectedLectureController(),
  new UserController(),
]);

app.listen();
database.connect();
