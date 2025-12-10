import { Sequelize } from 'sequelize';
import config from '../config/database';

export const sequelize = new Sequelize(config);