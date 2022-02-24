const Sequelize = require("sequelize");

const db = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = db;


