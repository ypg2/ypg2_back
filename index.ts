import App from "./src/app";
import database from "./src/database";
import UserController from "./src/controller/user.controller";

const app = new App([new UserController()]);

app.listen();
database.connect();
