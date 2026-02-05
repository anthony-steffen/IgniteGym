'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    // --- 1. CRIAR A ACADEMIA DE TESTE (TENANT) ---
    const tenantId = uuidv4();
    await queryInterface.bulkInsert('tenants', [{
      id: tenantId,
      name: 'Academia Principal',
      slug: 'academia-principal',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    // --- 2. CRIAR OS USUÁRIOS ---
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        tenant_id: null, // GLOBAL - Regra 1
        email: 'super@ignitegym.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        name: 'Super Admin Sistema',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        tenant_id: tenantId, // VINCULADO - Regra 2
        email: 'dono@academia.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        name: 'Dono da Unidade',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tenants', null, {});
  }
};