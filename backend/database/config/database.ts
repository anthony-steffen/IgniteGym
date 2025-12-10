import dotenv from "dotenv";
import { Options } from 'sequelize';

dotenv.config();

const { DB_USER, DB_PASS, DB_NAME, DB_HOST } = process.env;

const config = {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
} as Options;

export default config;

