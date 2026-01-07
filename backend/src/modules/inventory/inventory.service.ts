import { sequelize } from '../../database/sequelize';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Category } from '../../database/models/category.model';
import { CreateProductDTO, UpdateStockDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class InventoryService {
  async createProduct(data: CreateProductDTO) {
    const { tenantId, categoryId, name, price, description, initialStock = 0 } = data;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new AppError('A categoria selecionada não existe.', 404);
    }

    return await sequelize.transaction(async (t) => {
      const product = await Product.create({
        tenant_id: tenantId,
        category_id: categoryId,
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

  async updateStock(data: UpdateStockDTO) {
    const { tenantId, productId, quantity, type, reason } = data;

    const product = await Product.findOne({
      where: { id: productId, tenant_id: tenantId }
    });

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    return await sequelize.transaction(async (t) => {
      await StockMovement.create({
        tenant_id: tenantId,
        product_id: productId,
        quantity,
        type,
        reason
      }, { transaction: t });

      // Calcula novo saldo
      const adjustment = type === 'INPUT' ? quantity : -quantity;
      product.stock_quantity += adjustment;

      if (product.stock_quantity < 0) {
        throw new AppError('Estoque insuficiente para realizar esta saída.', 400);
      }

      await product.save({ transaction: t });
      return product;
    });
  }

  async listProducts(tenantId: string) {
    return Product.findAll({
      where: { tenant_id: tenantId, is_active: true },
      include: [{ association: 'category', attributes: ['name'] }],
      order: [['name', 'ASC']]
    });
  }
}