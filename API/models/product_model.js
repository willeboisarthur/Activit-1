const { DataTypes } = require('sequelize');
const { bdd } = require('../database/connexion');

const Product = bdd.define('Product',{
    id_product : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    name : {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description : {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    prix : {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    categorie : {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
})

module.exports= Product;