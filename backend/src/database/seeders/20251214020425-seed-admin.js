'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const tenantId = uuidv4();
    const adminId = uuidv4();

    const passwordHash = await bcrypt.hash('admin123', 10);

    //
    // 1. Criar Tenant padrão
    //
    await queryInterface.bulkInsert('tenants', [
      {
        id: tenantId,
        name: 'Academia Principal',
        slug: 'academia-principal',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    //
    // 2. Criar Admin padrão
    //
    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        tenant_id: tenantId,
        email: 'admin@ignitegym.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        name: 'Administrador',
        phone: '11999999999',
        is_active: true,
        last_login_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@ignitegym.com'
    });

    await queryInterface.bulkDelete('tenants', {
      slug: 'academia-principal'
    });
  }
};
