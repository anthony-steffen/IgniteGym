import { Category } from '../../database/models/category.model';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class CategoryService {
  async list() {
    return await Category.findAll({
      order: [['name', 'ASC']],
    });
  }

  async create(data: CreateCategoryDTO) {
    const categoryExists = await Category.findOne({
      where: { name: data.name }
    });

    if (categoryExists) {
      throw new AppError('Esta categoria já está cadastrada.', 400);
    }

    return await Category.create({
      name: data.name
    });
  }

  async update(data: UpdateCategoryDTO) {
    const category = await Category.findByPk(data.id);

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    category.name = data.name;
    await category.save();

    return category;
  }

  async delete(id: string) {
    const category = await Category.findByPk(id, {
      include: [{ association: 'products' }]
    });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    // Impede deletar categorias que possuem produtos vinculados
    if (category.products && category.products.length > 0) {
      throw new AppError('Não é possível excluir uma categoria que possui produtos vinculados.', 400);
    }

    await category.destroy();
  }
}