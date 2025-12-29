'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧹 Limpa para evitar conflito de ID fixo em tentativas repetidas
    await queryInterface.bulkDelete('categories', null, {});

    const categories = [
      { id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', name: 'Suplementos Alimentares', created_at: new Date(), updated_at: new Date() },
      { id: '2a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p', name: 'Equipamentos e Máquinas', created_at: new Date(), updated_at: new Date() },
      { id: '3a4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', name: 'Acessórios e Vestuário', created_at: new Date(), updated_at: new Date() }
    ];

    return queryInterface.bulkInsert('categories', categories, {});
  },
  // ...
};