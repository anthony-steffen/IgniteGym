import { Category } from '../../database/models/category.model';
import { Product } from '../../database/models/product.model';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class CategoryService {
  // Retorna apenas categorias da academia logada
  listCategories = async (tenantId: string) => {
    return await Category.findAll({
      where: { tenant_id: tenantId },
      order: [['name', 'ASC']]
    });
  };

  createCategory = async (tenantId: string, data: CreateCategoryDTO) => {
    // Verifica se já existe o mesmo nome PARA ESTE TENANT
    const categoryExists = await Category.findOne({
      where: { 
        name: data.name,
        tenant_id: tenantId 
      }
    });

    if (categoryExists) {
      throw new AppError('Esta categoria já está cadastrada nesta unidade.', 400);
    }

    return await Category.create({
      tenant_id: tenantId,
      name: data.name
    });
  };

  updateCategory = async (tenantId: string, data: UpdateCategoryDTO) => {
    const category = await Category.findOne({
      where: { id: data.id, tenant_id: tenantId }
    });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    category.name = data.name;
    await category.save();

    return category;
  };

  removeCategory = async (tenantId: string, id: string) => {
    const category = await Category.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ association: 'products' }]
    });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    // Regra de segurança: impede deletar categoria com produtos vinculados
    if (category.products && category.products.length > 0) {
      throw new AppError('Não é possível excluir uma categoria que possui produtos vinculados.', 400);
    }

    await category.destroy();
  };
}