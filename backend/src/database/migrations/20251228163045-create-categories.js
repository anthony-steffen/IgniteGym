'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      // ADICIONADO: Vínculo obrigatório com o Tenant
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false }, // Removido o 'unique: true' global
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    // ADICIONADO: Garante que o nome seja único apenas DENTRO da mesma academia (Tenant)
    await queryInterface.addIndex('categories', ['tenant_id', 'name'], {
      unique: true,
      name: 'categories_tenant_name_unique'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('categories');
  }
};