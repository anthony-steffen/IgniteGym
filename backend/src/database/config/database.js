// src/database/config/database.js
const dotenv = require('dotenv');
const path = require('path');

// Determina qual arquivo .env carregar com base na variável DOCKER injetada no docker-compose
const envPath = process.env.DOCKER === 'true'
  ? '.env.docker'
  : (process.env.NODE_ENV === 'production' ? '.env.railway' : '.env');

dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const commonConfig = {
  dialect: 'mysql',
  define: {
    timestamps: true,
    underscored: true,
  },
};

module.exports = {
  development: {
    ...commonConfig,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'ignitegym',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
  },
  production: {
    ...commonConfig,
    // Em produção (Railway), prioriza a URL completa fornecida pela plataforma
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 60000,
    },
  },
};