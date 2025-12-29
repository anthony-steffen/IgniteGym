'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'tenants', key: 'id' }
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: true, // Venda pode ser para alguém não matriculado
        references: { model: 'students', key: 'id' }
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      total_value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      payment_method: {
        type: Sequelize.ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX'),
        allowNull: false
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('sales'); }
};