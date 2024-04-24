import HttpError from "../error/HttpError";
import CategoryRepository from "../repository/category.repository";

export default class CategoryService {
  repository = new CategoryRepository();

  async getCategories() {
    const rows = await this.repository.selectCategories();

    if (!rows.length) {
      const message = "카테고리가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return {
      meta: { size: rows.length },
      data: rows,
    };
  }
}
