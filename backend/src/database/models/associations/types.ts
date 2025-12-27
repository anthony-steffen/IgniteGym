import type { ModelStatic } from 'sequelize';

export type AssociationType =
  | 'hasOne'
  | 'hasMany'
  | 'belongsTo';

export type AssociationConfig = {
  source: ModelStatic<any>;
  type: AssociationType;
  target: ModelStatic<any>;
  options: {
    foreignKey: string;
    as: string;
  };
};
