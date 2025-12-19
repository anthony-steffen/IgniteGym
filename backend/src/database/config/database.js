require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida");
}

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "mysql",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "mysql",
  },
};
