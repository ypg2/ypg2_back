import App from "./src/app";
import database from "./src/database";
import LectureController from "./src/controller/lecture.controller";
import UserController from "./src/controller/user.controller";

const app = new App([new UserController(), new LectureController()]);

app.listen();
database.connect();
