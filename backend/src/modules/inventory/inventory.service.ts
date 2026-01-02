import { sequelize } from '../../database/sequelize';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Category } from '../../database/models/category.model';
import { CreateProductDTO, UpdateStockDTO, RemoveProductDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class InventoryService {
  async createProduct(data: CreateProductDTO) {
    const { tenantId, categoryId, name, price, description, initialStock = 0 } = data;

    // 1. Valida se categoria existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new AppError('A categoria selecionada não existe.', 404);
    }

    try {
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
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro na transação de criação de produto:', error);
      throw new AppError('Erro ao processar criação do produto no estoque.', 500);
    }
  }

  async updateStock(data: UpdateStockDTO) {
    const { tenantId, productId, quantity, type, reason } = data;

    try {
      return await sequelize.transaction(async (t) => {
        const product = await Product.findOne({
          where: { id: productId, tenant_id: tenantId },
          lock: t.LOCK.UPDATE // Impede concorrência
        });

        if (!product) {
          throw new AppError('Produto não encontrado no estoque desta unidade.', 404);
        }

        // Validação de estoque insuficiente
        // Se a quantidade for negativa (saída) e o saldo atual for menor que o necessário
        if (quantity < 0 && (product.stock_quantity + quantity) < 0) {
          throw new AppError(`Estoque insuficiente. Saldo atual: ${product.stock_quantity}`, 400);
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
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro na transação de atualização de estoque:', error);
      throw new AppError('Falha ao atualizar movimentação de estoque.', 500);
    }
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
      where: { id: productId, tenant_id: tenantId }
    });

    if (!product) {
      throw new AppError('Produto não encontrado para exclusão.', 404);
    }

    try {
      // Verificamos se há estoque antes de deletar (regra opcional)
      if (product.stock_quantity > 0) {
        throw new AppError('Não é possível remover um produto que ainda possui saldo em estoque.', 400);
      }

      await product.destroy();
      return product;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Este produto possui histórico de movimentações e não pode ser removido.', 400);
    }
  }
}