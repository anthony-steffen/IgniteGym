import { Request, Response } from 'express';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export class CategoryController {
  list = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Tenant não identificado.' });
    }

    const categories = await categoryService.listCategories(tenantId as string);
    return res.json(categories);
  };

  create = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ 
        message: 'É necessário informar um tenantId para criar uma categoria.' 
      });
    }

    const category = await categoryService.createCategory(tenantId, req.body);
    return res.status(201).json(category);
  };

  update = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    const category = await categoryService.updateCategory(tenantId, {
      id,
      ...req.body,
    });
    return res.json(category);
  };

  delete = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    await categoryService.removeCategory(tenantId, id);
    return res.status(204).send();
  };
}