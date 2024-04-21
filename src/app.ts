import express, { Application } from "express";
import IController from "./interface/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import logMiddleware from "./middleware/log.middleware";
import pathErrorMiddleware from "./middleware/path-error.middleware";

export default class App {
  app: Application = express();

  constructor(controllers: IController[]) {
    this.initPreMiddlewares();
    this.initControllers(controllers);
    this.initPostMiddlewares();
  }

  listen() {
    this.app.listen(3001, () => console.log("Listening on 3001"));
  }

  private initPreMiddlewares() {
    this.app.use(express.json());
    this.app.use(logMiddleware);
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller) =>
      this.app.use("/api", controller.router)
    );
  }

  private initPostMiddlewares() {
    this.app.use(pathErrorMiddleware);
    this.app.use(errorMiddleware);
  }
}
