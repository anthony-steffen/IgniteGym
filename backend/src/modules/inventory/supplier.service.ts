import { Supplier } from '../../database/models/supplier.model';
import { CreateSupplierDTO, UpdateSupplierDTO, ListSupplierDTO } from './dtos/inventory.dto';
import { Op } from 'sequelize';
import { AppError } from '../../errors/AppError';

export class SupplierService {
  createSupplier = async (data: CreateSupplierDTO) => {
    return Supplier.create({
      tenant_id: data.tenantId,
      name: data.name,
      description: data.description,
      email: data.email,
      phone: data.phone,
      is_active: true,
    });
  };

  listSuppliers = async (tenantId: string, filters: ListSupplierDTO) => {
    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    return Supplier.findAll({
      where,
      order: [['name', 'ASC']],
    });
  };

  updateSupplier = async (data: UpdateSupplierDTO) => {
    const { tenantId, id, ...updateData } = data;
    const supplier = await Supplier.findOne({ where: { id, tenant_id: tenantId } });

    if (!supplier) throw new AppError('Fornecedor nao encontrado.', 404);

    return supplier.update(updateData);
  };

  removeSupplier = async (tenantId: string, id: string) => {
    const supplier = await Supplier.findOne({ where: { id, tenant_id: tenantId } });

    if (!supplier) throw new AppError('Fornecedor nao encontrado.', 404);

    return supplier.destroy();
  };
}
