const Sequelize = require("sequelize");

const db = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres'
});

module.exports = db;


