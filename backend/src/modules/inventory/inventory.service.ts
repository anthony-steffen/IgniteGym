import { sequelize } from '../../database/sequelize';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Category } from '../../database/models/category.model';
import { CreateProductDTO, UpdateProductDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class InventoryService {
  async createProduct(data: CreateProductDTO) {
    const { tenantId, category_id, name, price, description, initialStock = 0 } = data;

    const category = await Category.findByPk(category_id);
    if (!category) throw new AppError('A categoria selecionada não existe.', 404);

    return await sequelize.transaction(async (t) => {
      const product = await Product.create({
        tenant_id: tenantId,
        category_id,
        name,
        price,
        description,
        stock_quantity: initialStock
      }, { transaction: t });

      if (initialStock > 0) {
        await StockMovement.create({
          tenant_id: tenantId,
          product_id: product.id,
          quantity: initialStock,
          type: 'INPUT',
          reason: 'Carga inicial de estoque'
        }, { transaction: t });
      }
      return product;
    });
  }

  async updateProduct(data: UpdateProductDTO) {
    const { tenantId, productId, ...updateData } = data;

    const product = await Product.findOne({
      where: { id: productId, tenant_id: tenantId }
    });

    if (!product) throw new AppError('Produto não encontrado.', 404);

    if (updateData.category_id) {
      const category = await Category.findByPk(updateData.category_id);
      if (!category) throw new AppError('Nova categoria inválida.', 404);
    }

    return await product.update(updateData);
  }

  async removeProduct(tenantId: string, productId: string) {
    const product = await Product.findOne({
      where: { id: productId, tenant_id: tenantId }
    });

    if (!product) throw new AppError('Produto não encontrado.', 404);
    
    // Regra: Não remove se houver estoque (opcional, conforme seu service original)
    if (product.stock_quantity > 0) {
      throw new AppError('Não é possível remover produto com saldo em estoque.', 400);
    }

    await product.destroy();
  }

  async listProducts(tenantId: string) {
    return Product.findAll({
      where: { tenant_id: tenantId },
      include: [{ association: 'category', attributes: ['name'] }],
      order: [['name', 'ASC']]
    });
  }
}