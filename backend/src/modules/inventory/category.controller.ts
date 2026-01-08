import { Request, Response } from 'express';
import { CategoryService } from './category.service';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  list = async (req: Request, res: Response) => {
    const categories = await this.service.list();
    return res.json(categories);
  };

  create = async (req: Request, res: Response) => {
    const category = await this.service.create(req.body);
    return res.status(201).json(category);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await this.service.update({
      id,
      ...req.body,
    });
    return res.json(category);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(id);
    return res.status(204).send();
  };
}