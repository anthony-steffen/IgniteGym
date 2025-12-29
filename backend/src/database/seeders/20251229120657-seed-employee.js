'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // O query retorna [rows, metadata]
    const [users] = await queryInterface.sequelize.query(
      "SELECT id, tenant_id FROM users WHERE role = 'ADMIN' LIMIT 1"
    );

    // Verificamos se o array de linhas tem conteúdo
    if (!users || users.length === 0) {
      throw new Error('Nenhum administrador encontrado para seed de funcionários');
    }

    // Pegamos os dados da primeira linha
    const admin = users[0];

    await queryInterface.bulkInsert('employees', [
      {
        id: uuidv4(),
        user_id: admin.id,      // Acessando a propriedade correta
        tenant_id: admin.tenant_id, // Acessando a propriedade correta
        role_title: 'Administrador Geral',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};