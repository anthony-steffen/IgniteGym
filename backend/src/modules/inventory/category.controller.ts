import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { AppError } from '../../errors/AppError';

const categoryService = new CategoryService();

function getStatusCode(error: unknown) {
  return error instanceof AppError ? error.statusCode : 500;
}

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Erro interno do servidor.';
}

export class CategoryController {
  list = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const categories = await categoryService.listCategories(tenantId);
      return res.json(categories);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const category = await categoryService.createCategory(tenantId, req.body);
      return res.status(201).json(category);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
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
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      await categoryService.removeCategory(tenantId, id);
      return res.status(204).send();
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };
}
