// src/modules/sales/sales.service.ts
import { sequelize } from '../../database/sequelize';
import { Sale } from '../../database/models/sale.model';
import { SaleItem } from '../../database/models/sale-item.model';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { AppError } from '../../errors/AppError';

export class SalesService {
  async createSale(data: any) {
    const { tenantId, studentId, employeeId, items, paymentMethod } = data;

    // Validação básica de entrada
    if (!items || items.length === 0) {
      throw new AppError('Não é possível realizar uma venda sem itens.', 400);
    }

    try {
      return await sequelize.transaction(async (t) => {
        let totalSaleValue = 0;

        // 1. Criar a Venda (Cabeçalho)
        const sale = await Sale.create({
          tenant_id: tenantId,
          student_id: studentId,
          employee_id: employeeId,
          payment_method: paymentMethod,
          total_value: 0 
        }, { transaction: t });

        for (const item of items) {
          const product = await Product.findOne({
            where: { id: item.productId, tenant_id: tenantId },
            lock: t.LOCK.UPDATE // 🛡️ Evita que outro vendedor venda o mesmo item simultaneamente
          });

          // Validação de existência e estoque
          if (!product) {
            throw new AppError(`Produto com ID ${item.productId} não encontrado.`, 404);
          }

          if (product.stock_quantity < item.quantity) {
            throw new AppError(
              `Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.stock_quantity}`, 
              400
            );
          }

          const subtotal = product.price * item.quantity;
          totalSaleValue += subtotal;

          // 2. Criar Item da Venda
          await SaleItem.create({
            sale_id: sale.id,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
            subtotal
          }, { transaction: t });

          // 3. Baixa no Estoque (Product)
          product.stock_quantity -= item.quantity;
          await product.save({ transaction: t });

          // 4. Registrar Movimentação de Saída (StockMovement)
          await StockMovement.create({
            tenant_id: tenantId,
            product_id: product.id,
            quantity: -item.quantity, // Quantidade negativa indica saída
            type: 'SALE',
            reason: `Venda #${sale.id.toString().substring(0, 8)}`
          }, { transaction: t });
        }

        // 5. Atualizar valor total final da venda
        sale.total_value = totalSaleValue;
        await sale.save({ transaction: t });

        return sale;
      });
    } catch (error: any) {
      // Se for um erro que nós lançamos (AppError), repassa para o middleware
      if (error instanceof AppError) throw error;

      // Log para o desenvolvedor
      console.error('❌ Erro crítico na transação de venda:', error);
      
      // Erro genérico para o frontend caso seja algo inesperado (ex: banco caiu)
      throw new AppError('Falha ao processar a venda. Tente novamente.', 500);
    }
  }
}