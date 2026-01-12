'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'supplier_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'supplier_id');
  },
};