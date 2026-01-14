require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.railway'
      : '.env',
});

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },

  production: {
    url: process.env.MYSQL_URL || process.env.DATABASE_URL,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000
    }
  },
};
