const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

let connectionUrl = config.url || (config.use_env_variable ? process.env[config.use_env_variable] : null);

// Sanitasi parameter sslmode dari connection string agar tidak menimpa ssl dialectOptions
if (connectionUrl) {
  try {
    const urlObj = new URL(connectionUrl);
    urlObj.searchParams.delete('sslmode');
    connectionUrl = urlObj.toString();
  } catch (_e) {
    // jika bukan URL format standar, biarkan
  }
}

const baseOptions = {
  ...config,
  dialectModule: pg
};

if (env === 'production' || connectionUrl) {
  baseOptions.dialectOptions = {
    ...(baseOptions.dialectOptions || {}),
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

let sequelize;
if (connectionUrl) {
  sequelize = new Sequelize(connectionUrl, baseOptions);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    baseOptions
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
