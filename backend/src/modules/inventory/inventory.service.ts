import { sequelize } from '../../database/sequelize';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Category } from '../../database/models/category.model';
import { CreateProductDTO, UpdateStockDTO, RemoveProductDTO } from './dtos/inventory.dto';

export class InventoryService {
  
  async createProduct(data: CreateProductDTO) {
    const { tenantId, categoryId, name, price, description, initialStock = 0 } = data;

    // 1. Valida se categoria existe
    const category = await Category.findByPk(categoryId);
    if (!category) throw new Error('Categoria não encontrada');

    // 2. Cria produto e movimentação inicial em uma transação
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

    return await sequelize.transaction(async (t) => {
      const product = await Product.findOne({
        where: { id: productId, tenant_id: tenantId },
        lock: t.LOCK.UPDATE // Impede concorrência durante a atualização
      });

      if (!product) throw new Error('Produto não encontrado');

      // Validação de estoque negativo para saídas
      if (quantity < 0 && (product.stock_quantity + quantity) < 0) {
        throw new Error('Estoque insuficiente para esta operação');
      }

      // 1. Registra a movimentação
      await StockMovement.create({
        tenant_id: tenantId,
        product_id: productId,
        quantity,
        type,
        reason
      }, { transaction: t });

      // 2. Atualiza o saldo no produto
      product.stock_quantity += quantity;
      await product.save({ transaction: t });

      return product;
    });
  }

  async listProducts(tenantId: string) {
    return Product.findAll({
      where: { tenant_id: tenantId },
      include: [{ association: 'category' }],
      order: [['name', 'ASC']]
    });
  }

  async removeProduct(data: RemoveProductDTO) {
    const { tenantId, productId } = data;

    const product = await Product.findOne({
      where: { id: productId, tenant_id: tenantId },
      lock: true // Impede concorrência durante a atualização
    });

    if (!product) throw new Error('Produto não encontrado');

    await product.destroy();

    return product;
  }
}