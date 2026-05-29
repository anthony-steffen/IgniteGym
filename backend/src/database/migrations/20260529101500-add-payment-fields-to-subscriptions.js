'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('subscriptions', 'payment_status', {
      type: Sequelize.ENUM('PAID', 'PENDING', 'OVERDUE'),
      allowNull: false,
      defaultValue: 'PAID',
    });

    await queryInterface.addColumn('subscriptions', 'next_due_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('subscriptions', 'last_payment_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('subscriptions', 'last_payment_at');
    await queryInterface.removeColumn('subscriptions', 'next_due_date');
    await queryInterface.removeColumn('subscriptions', 'payment_status');
  },
};
