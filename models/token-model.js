
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const UserModel = require('./user-model');


const tokenModel = sequelize.define('token', {
    user: {
        type: Sequelize.INTEGER,
        require: true,
        references:{
            model: UserModel,
            key: 'id'
        }
    },
    refreshToken: {
        type: Sequelize.STRING,
        require: true,
    }
});

module.exports = tokenModel;