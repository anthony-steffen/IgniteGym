// src/database/models/associations
import type { ModelStatic } from 'sequelize';

import { Tenant } from '../database/models/tenant.model';
import { User } from '../database/models/user.model';
import { Employee } from '../database/models/employee.model';
import { Student } from '../database/models/student.model';
import { Plan } from '../database/models/plan.model';
import { Subscription } from '../database/models/subscription.model';

/**
 * Tipos de associações suportadas
 * (espelha exatamente os métodos do Sequelize)
 */
type AssociationType =
  | 'hasOne'
  | 'hasMany'
  | 'belongsTo';

/**
 * Configuração genérica de associação
 * Usada para executar tudo via loop
 */
type AssociationConfig = {
  source: ModelStatic<any>;
  type: AssociationType;
  target: ModelStatic<any>;
  options: {
    foreignKey: string;
    as: string;
  };
};

/**
 * 🔗 TODAS AS ASSOCIAÇÕES DO SISTEMA
 * Ordem aqui NÃO importa (models já estão inicializados)
 */
export const associations: AssociationConfig[] = [

  /**
   * ============================
   * TENANT ↔ USERS
   * Um tenant possui vários usuários
   * ============================
   */
  {
    source: Tenant,
    type: 'hasMany',
    target: User,
    options: {
      foreignKey: 'tenant_id',
      as: 'users',
    },
  },
  {
    source: User,
    type: 'belongsTo',
    target: Tenant,
    options: {
      foreignKey: 'tenant_id',
      as: 'tenant',
    },
  },

  /**
   * ============================
   * USER ↔ EMPLOYEE
   * Um usuário pode ser um funcionário
   * ============================
   */
  {
    source: User,
    type: 'hasOne',
    target: Employee,
    options: {
      foreignKey: 'user_id',
      as: 'employee',
    },
  },
  {
    source: Employee,
    type: 'belongsTo',
    target: User,
    options: {
      foreignKey: 'user_id',
      as: 'user',
    },
  },

  /**
   * ============================
   * USER ↔ STUDENT
   * Um usuário pode ser um aluno
   * ============================
   */
  {
    source: User,
    type: 'hasOne',
    target: Student,
    options: {
      foreignKey: 'user_id',
      as: 'student',
    },
  },
  {
    source: Student,
    type: 'belongsTo',
    target: User,
    options: {
      foreignKey: 'user_id',
      as: 'user',
    },
  },

  /**
   * ============================
   * TENANT ↔ STUDENTS
   * Um tenant possui vários alunos
   * ============================
   */
  {
    source: Tenant,
    type: 'hasMany',
    target: Student,
    options: {
      foreignKey: 'tenant_id',
      as: 'students',
    },
  },
  {
    source: Student,
    type: 'belongsTo',
    target: Tenant,
    options: {
      foreignKey: 'tenant_id',
      as: 'tenant',
    },
  },

  /**
   * ============================
   * TENANT ↔ PLANS
   * Um tenant possui vários planos
   * ============================
   */
  {
    source: Tenant,
    type: 'hasMany',
    target: Plan,
    options: {
      foreignKey: 'tenant_id',
      as: 'plans',
    },
  },
  {
    source: Plan,
    type: 'belongsTo',
    target: Tenant,
    options: {
      foreignKey: 'tenant_id',
      as: 'tenant',
    },
  },

  /**
   * ============================
   * STUDENT ↔ SUBSCRIPTIONS
   * Um aluno pode ter várias assinaturas
   * ============================
   */
  {
    source: Student,
    type: 'hasMany',
    target: Subscription,
    options: {
      foreignKey: 'student_id',
      as: 'subscriptions',
    },
  },
  {
    source: Subscription,
    type: 'belongsTo',
    target: Student,
    options: {
      foreignKey: 'student_id',
      as: 'student',
    },
  },
];
