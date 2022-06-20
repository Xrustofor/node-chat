
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const UserModel = sequelize.define('User', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  login: {
    type:  Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
});

module.exports = UserModel;