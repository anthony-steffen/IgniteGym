'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    // 🔎 busca um tenant existente
    const [tenants] = await queryInterface.sequelize.query(
      'SELECT id FROM tenants LIMIT 1'
    );

    if (!tenants || tenants.length === 0) {
      throw new Error('Nenhum tenant encontrado para seed de planos');
    }

    const tenantId = tenants[0].id;
    const now = new Date();

    await queryInterface.bulkInsert('plans', [
      {
        id: uuidv4(),
        tenant_id: tenantId,
        name: 'Mensal',
        price: 120,
        duration_days: 30,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        name: 'Trimestral',
        price: 330,
        duration_days: 90,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        name: 'Anual',
        price: 1200,
        duration_days: 365,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
