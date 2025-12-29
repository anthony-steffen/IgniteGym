'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 🔍 Verifica se o tenant já existe pelo slug
    const [existingTenants] = await queryInterface.sequelize.query(
      "SELECT id FROM tenants WHERE slug = 'academia-principal' LIMIT 1"
    );

    let tenantId;

    if (existingTenants.length > 0) {
      tenantId = existingTenants[0].id;
    } else {
      tenantId = uuidv4();
      await queryInterface.bulkInsert('tenants', [{
        id: tenantId,
        name: 'Academia Principal',
        slug: 'academia-principal',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    // 🔍 Verifica se o usuário admin já existe
    const [existingUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@ignitegym.com' LIMIT 1`
    );

    if (existingUsers.length === 0) {
      await queryInterface.bulkInsert('users', [{
        id: uuidv4(),
        tenant_id: tenantId,
        email: 'admin@ignitegym.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        name: 'Administrador',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },
  // ... down permanece igual
};