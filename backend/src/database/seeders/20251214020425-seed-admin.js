'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    // 🔍 Verifica apenas se o usuário admin global já existe
    const [existingUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@ignitegym.com' LIMIT 1`
    );

    if (existingUsers.length === 0) {
      await queryInterface.bulkInsert('users', [{
        id: uuidv4(),
        tenant_id: null, // 🟢 Correto: Admin Global não pertence a nenhuma unidade
        email: 'admin@ignitegym.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        name: 'Administrador Geral',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove apenas o admin global
    await queryInterface.bulkDelete('users', {
      email: 'admin@ignitegym.com',
    });
  },
};