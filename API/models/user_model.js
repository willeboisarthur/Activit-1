const { DataTypes } = require('sequelize');
const { bdd } = require('../database/connexion.js');

const User = bdd.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: { len: [3, 30] }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    }
});

module.exports = User;