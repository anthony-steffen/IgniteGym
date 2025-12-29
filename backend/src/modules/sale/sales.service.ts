// src/modules/sales/sales.service.ts
import { sequelize } from '../../database/sequelize';
import { Sale } from '../../database/models/sale.model';
import { SaleItem } from '../../database/models/sale-item.model';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';

export class SalesService {
  async createSale(data: any) {
    const { tenantId, studentId, employeeId, items, paymentMethod } = data;

    return await sequelize.transaction(async (t) => {
      let totalSaleValue = 0;

      // 1. Criar a Venda (Cabeçalho)
      const sale = await Sale.create({
        tenant_id: tenantId,
        student_id: studentId,
        employee_id: employeeId,
        payment_method: paymentMethod,
        total_value: 0 // Atualizaremos após calcular os itens
      }, { transaction: t });

      for (const item of items) {
        const product = await Product.findOne({
          where: { id: item.productId, tenant_id: tenantId },
          lock: t.LOCK.UPDATE // Bloqueia o produto para evitar venda simultânea sem estoque
        });

        if (!product || product.stock_quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product?.name || 'Desconhecido'}`);
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

        // 4. Registrar Movimentação (StockMovement)
        await StockMovement.create({
          tenant_id: tenantId,
          product_id: product.id,
          quantity: -item.quantity,
          type: 'SALE',
          reason: `Venda #${sale.id.substring(0, 8)}`
        }, { transaction: t });
      }

      // 5. Atualizar valor total da venda
      sale.total_value = totalSaleValue;
      await sale.save({ transaction: t });

      return sale;
    });
  }
}