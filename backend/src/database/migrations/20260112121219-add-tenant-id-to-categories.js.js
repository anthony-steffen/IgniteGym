'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Adiciona a coluna permitindo NULL temporariamente
    await queryInterface.addColumn('categories', 'tenant_id', {
      type: Sequelize.UUID,
      allowNull: true, // Temporário para não quebrar nos dados existentes
      references: { model: 'tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // 2. Tenta associar as categorias existentes a um Tenant real.
    // Substitua o UUID abaixo pelo ID de um Tenant que já exista no seu banco.
    const [tenants] = await queryInterface.sequelize.query('SELECT id FROM tenants LIMIT 1;');

    if (tenants.length > 0) {
      const defaultTenantId = tenants[0].id;
      await queryInterface.sequelize.query(
        `UPDATE categories SET tenant_id = '${defaultTenantId}' WHERE tenant_id IS NULL;`
      );
    }

    // 3. Agora que os dados estão preenchidos, alteramos para allowNull: false
    await queryInterface.changeColumn('categories', 'tenant_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'tenants', key: 'id' },
    });

    // 4. Remove a constraint UNIQUE antiga (nome 'name')
    await queryInterface.removeConstraint('categories', 'name');

    // 5. Cria o novo índice composto
    await queryInterface.addIndex('categories', ['name', 'tenant_id'], {
      unique: true,
      name: 'categories_name_tenant_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('categories', 'categories_name_tenant_unique');
    await queryInterface.removeColumn('categories', 'tenant_id');

    // Tenta restaurar a constraint original
    await queryInterface.addConstraint('categories', {
      fields: ['name'],
      type: 'unique',
      name: 'name'
    });
  },
};