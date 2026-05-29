import { sequelize } from '../../database/sequelize';
import { Sale } from '../../database/models/sale.model';
import { SaleItem } from '../../database/models/sale-item.model';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Employee } from '../../database/models/employee.model';
import { AppError } from '../../errors/AppError';

type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

interface SaleItemInput {
  productId: string;
  quantity: number;
}

interface CreateSaleInput {
  tenantId: string;
  studentId?: string | null;
  employeeUserId: string;
  items: SaleItemInput[];
  paymentMethod: PaymentMethod;
}

export class SalesService {
  async createSale(data: CreateSaleInput) {
    const { tenantId, studentId, employeeUserId, items, paymentMethod } = data;

    if (!items || items.length === 0) {
      throw new AppError('Nao e possivel realizar uma venda sem itens.', 400);
    }

    const employee = await Employee.findOne({
      where: { user_id: employeeUserId, tenant_id: tenantId, is_active: true },
    });

    if (!employee) {
      throw new AppError('Funcionario nao autorizado para registrar vendas.', 403);
    }

    return sequelize.transaction(async (t) => {
      let totalSaleValue = 0;

      const sale = await Sale.create(
        {
          tenant_id: tenantId,
          student_id: studentId ?? null,
          employee_id: employee.id,
          payment_method: paymentMethod,
          total_value: 0,
        },
        { transaction: t }
      );

      for (const item of items) {
        if (!item.productId || item.quantity <= 0) {
          throw new AppError('Item de venda invalido.', 400);
        }

        const product = await Product.findOne({
          where: { id: item.productId, tenant_id: tenantId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!product) {
          throw new AppError(`Produto com ID ${item.productId} nao encontrado.`, 404);
        }

        if (product.stock_quantity < item.quantity) {
          throw new AppError(
            `Estoque insuficiente para ${product.name}. Disponivel: ${product.stock_quantity}.`,
            400
          );
        }

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * item.quantity;
        totalSaleValue += subtotal;

        await SaleItem.create(
          {
            sale_id: sale.id,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: unitPrice,
            subtotal,
          },
          { transaction: t }
        );

        product.stock_quantity -= item.quantity;
        await product.save({ transaction: t });

        await StockMovement.create(
          {
            tenant_id: tenantId,
            product_id: product.id,
            quantity: -item.quantity,
            type: 'SALE',
            reason: `Venda #${sale.id.toString().substring(0, 8)}`,
          },
          { transaction: t }
        );
      }

      sale.total_value = totalSaleValue;
      await sale.save({ transaction: t });

      return sale;
    });
  }

  async listSales(tenantId: string) {
    return Sale.findAll({
      where: { tenant_id: tenantId },
      include: [
        {
          association: 'items',
          include: [{ association: 'product', attributes: ['id', 'name'] }],
        },
        {
          association: 'student',
          include: [{ association: 'user', attributes: ['id', 'name'] }],
        },
        {
          association: 'employee',
          include: [{ association: 'user', attributes: ['id', 'name'] }],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 100,
    });
  }
}
