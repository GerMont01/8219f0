const Sequelize = require("sequelize");

const db = new Sequelize({
  host:'localhost',
  port:5432,
  database:'messenger',
  dialect:'postgres',
  username:'postgres',
  password:'admin'
});

module.exports = db;


