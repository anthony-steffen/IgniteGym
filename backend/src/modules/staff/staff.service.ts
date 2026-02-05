// src/modules/staff/staff.service.ts
import bcrypt from "bcrypt";
import { sequelize } from "../../database/sequelize";
import { User } from "../../database/models/user.model";
import { Tenant } from "../../database/models/tenant.model";
import { Employee } from "../../database/models/employee.model";
import { AppError } from "../../errors/AppError";

const { v4: uuidv4 } = require('uuid');

export class StaffService {
  /**
   * Fluxo A: Criação de Nova Academia + Admin
   */
  static async create(data: any) {
    const { name, email, password, gymName } = data;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) throw new AppError("E-mail já cadastrado.", 400);

    const transaction = await sequelize.transaction();

    try {
      const slug = gymName.toLowerCase().trim().replace(/\s+/g, '-');
      
      const tenant = await Tenant.create({
        id: uuidv4(),
        name: gymName,
        slug,
        is_active: true,
        timezone: 'America/Sao_Paulo',
      }, { transaction });

      const user = await User.create({
        id: uuidv4(),
        name,
        email,
        password_hash: await bcrypt.hash(password, 10),
        role: 'ADMIN',
        tenant_id: tenant.id,
        is_active: true
      }, { transaction });

      await Employee.create({
        id: uuidv4(),
        user_id: user.id,
        tenant_id: tenant.id,
        role_title: 'Proprietário',
        is_active: true
      }, { transaction });

      await transaction.commit();
      return { id: user.id, name: user.name, slug: tenant.slug };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async list(tenantId: string) {
    return await Employee.findAll({
      where: { tenant_id: tenantId, is_active: true },
      include: [{ 
        model: User, 
        as: 'user', 
        attributes: ['id', 'name', 'email', 'role'] 
      }]
    });
  }

  static async findOne(id: string, tenantId: string) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ model: User, as: 'user' }]
    });

    if (!employee) throw new AppError("Colaborador não encontrado.", 404);
    return employee;
  }

  static async update(id: string, tenantId: string, data: any) {
    const employee = await this.findOne(id, tenantId);
    
    // Inicia transação caso precise atualizar User e Employee simultaneamente
    const transaction = await sequelize.transaction();
    try {
      if (data.name || data.email) {
        await User.update(
          { name: data.name, email: data.email },
          { where: { id: employee.user_id }, transaction }
        );
      }

      await employee.update(
        { role_title: data.role_title, is_active: data.is_active },
        { transaction }
      );

      await transaction.commit();
      return await this.findOne(id, tenantId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deactivate(id: string, tenantId: string) {
    const employee = await this.findOne(id, tenantId);
    
    const transaction = await sequelize.transaction();
    try {
      // Desativa o funcionário e o acesso do usuário
      await employee.update({ is_active: false }, { transaction });
      await User.update(
        { is_active: false },
        { where: { id: employee.user_id }, transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}