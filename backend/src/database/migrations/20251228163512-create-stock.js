'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_movements', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' } },
      product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' } },
      quantity: { type: Sequelize.INTEGER, allowNull: false }, // Positivo para entrada, negativo para saída
      type: { type: Sequelize.ENUM('INPUT', 'OUTPUT', 'SALE', 'ADJUSTMENT'), allowNull: false },
      reason: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stock_movements');
  }
};