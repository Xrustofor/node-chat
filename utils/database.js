const Sequelize = require('sequelize');

const DB_NAME = 'xdcccuti_chat';
const USER_NAME = 'xdcccuti_xdcccuti';
const PASSWORD = '6g~.y8$Ug(}c';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});


module.exports = sequelize;