import { Router, Request, Response, NextFunction } from "express";
import IController from "../interface/controller.interface";
import CategoryService from "../service/cateogry.service";

export default class CategoryController implements IController {
  path = "/categories";
  router = Router();
  service = new CategoryService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(`${this.path}`, this.getCategories);
  }

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { meta, data } = await this.service.getCategories();

      res.json({
        meta,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
