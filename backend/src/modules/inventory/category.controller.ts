import { Request, Response } from 'express';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export class CategoryController {
  list = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const categories = await categoryService.listCategories(tenantId);
    return res.json(categories);
  };

  create = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const category = await categoryService.createCategory(tenantId, req.body);
    return res.status(201).json(category);
  };

  update = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id } = req.params;

    const category = await categoryService.updateCategory(tenantId, {
      id,
      ...req.body,
    });
    return res.json(category);
  };

  delete = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id } = req.params;

    await categoryService.removeCategory(tenantId, id);
    return res.status(204).send();
  };
}