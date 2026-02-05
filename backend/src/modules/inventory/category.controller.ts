import { Request, Response } from 'express';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export class CategoryController {
  list = async (req: Request, res: Response) => {
    try {
      // O middleware tenantTranslate já garantiu que req.tenantId existe e é válido
      const tenantId = req.tenantId as string;

      const categories = await categoryService.listCategories(tenantId);
      return res.json(categories);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;

      // Não precisamos mais validar o tenantId aqui, o middleware já barrou se não existisse
      const category = await categoryService.createCategory(tenantId, req.body);
      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      const category = await categoryService.updateCategory(tenantId, {
        id,
        ...req.body,
      });
      return res.json(category);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      await categoryService.removeCategory(tenantId, id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}