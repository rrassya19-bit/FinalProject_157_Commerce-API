require('dotenv').config();
const pg = require('pg');

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_DATABASE || 'commerceapi',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectModule: pg,
    logging: false
  },
  production: {
    use_env_variable: 'POSTGRES_URL',
    url: process.env.POSTGRES_URL,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
