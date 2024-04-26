import express, { Application } from "express";
import cors from "cors";
import {
  errorMiddleware,
  logMiddleware,
  pathErrorMiddleware,
} from "./middleware";
import IController from "./type/controller";

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
    const corsOptions = {
      credentials: true,
      exposedHeaders: ["Authorization"],
      origin: true,
    };

    this.app.use(cors(corsOptions));
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
