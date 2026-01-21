'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});

    // 1. Busca o ID do primeiro tenant disponível (ex: sua academia de teste)
    const tenants = await queryInterface.sequelize.query(
      'SELECT id FROM tenants LIMIT 1;'
    );

    if (!tenants[0] || tenants[0].length === 0) {
      console.log("⚠️ Pulei o seed de categorias: Nenhum Tenant encontrado.");
      return;
    }

    const tenantId = tenants[0][0].id;

    const categories = [
      { id: uuidv4(), tenant_id: tenantId, name: 'Suplementos Alimentares', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), tenant_id: tenantId, name: 'Equipamentos e Máquinas', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), tenant_id: tenantId, name: 'Acessórios e Vestuário', created_at: new Date(), updated_at: new Date() }
    ];

    return queryInterface.bulkInsert('categories', categories, {});
  },
  async down(queryInterface) {
    return queryInterface.bulkDelete('categories', null, {});
  }
};