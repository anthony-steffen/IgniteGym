'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Adicionar novas colunas na tabela de Employees
    await queryInterface.addColumn('employees', 'salary', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Permitir nulo para não quebrar registros antigos
    });

    await queryInterface.addColumn('employees', 'weekly_hours', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('employees', 'work_schedule', {
      type: Sequelize.JSON, // Armazenará o objeto de horários Segunda a Sábado
      allowNull: true,
    });

    // 2. Criar a nova tabela de Registro de Ponto (TimeLogs)
    await queryInterface.createTable('time_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clock_in: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      clock_out: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('time_logs');
    await queryInterface.removeColumn('employees', 'salary');
    await queryInterface.removeColumn('employees', 'weekly_hours');
    await queryInterface.removeColumn('employees', 'work_schedule');
  }
};