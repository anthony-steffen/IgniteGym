import { sequelize } from '../../database/sequelize';
import { Product } from '../../database/models/product.model';
import { StockMovement } from '../../database/models/stock-moviments.model';
import { Category } from '../../database/models/category.model';
import { Supplier } from '../../database/models/supplier.model'; // Adicionado
import { CreateProductDTO, UpdateProductDTO } from './dtos/inventory.dto';
import { AppError } from '../../errors/AppError';

export class InventoryService {
  async createProduct(data: CreateProductDTO) {
    const { 
      tenantId, category_id, supplier_id, name, 
      price, description, initialStock = 0, image_url 
    } = data;

    // Ajuste: Verifica se a categoria pertence ao tenant
    const category = await Category.findOne({ 
      where: { id: category_id, tenant_id: tenantId } 
    });
    if (!category) throw new AppError('A categoria selecionada não existe ou não pertence a esta unidade.', 404);

    // Ajuste: Verifica se o fornecedor pertence ao tenant (se enviado)
    if (supplier_id) {
      const supplier = await Supplier.findOne({ 
        where: { id: supplier_id, tenant_id: tenantId } 
      });
      if (!supplier) throw new AppError('O fornecedor selecionado não existe.', 404);
    }

    return await sequelize.transaction(async (t) => {
      const product = await Product.create({
        tenant_id: tenantId,
        category_id,
        supplier_id, // Novo campo integrado
        name,
        price,
        description,
        stock_quantity: initialStock,
        image_url,
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

    // Validação de segurança para troca de categoria
    if (updateData.category_id) {
      const category = await Category.findOne({ 
        where: { id: updateData.category_id, tenant_id: tenantId } 
      });
      if (!category) throw new AppError('Nova categoria inválida.', 404);
    }

    // Validação de segurança para troca de fornecedor
    if (updateData.supplier_id) {
      const supplier = await Supplier.findOne({ 
        where: { id: updateData.supplier_id, tenant_id: tenantId } 
      });
      if (!supplier) throw new AppError('Novo fornecedor inválido.', 404);
    }

    return await product.update(updateData);
  }

  async removeProduct(tenantId: string, productId: string) {
    const product = await Product.findOne({
      where: { id: productId, tenant_id: tenantId }
    });

    if (!product) throw new AppError('Produto não encontrado.', 404);
    
    if (product.stock_quantity > 0) {
      throw new AppError('Não é possível remover produto com saldo em estoque.', 400);
    }

    await product.destroy();
  }

  async listProducts(tenantId: string) {
    return Product.findAll({
      where: { tenant_id: tenantId, is_active: true },
      include: [
        { association: 'category', attributes: ['name'] },
        { association: 'supplier', attributes: ['name'] } // Agora traz o nome da marca/fornecedor
      ],
      order: [['name', 'ASC']]
    });
  }
}