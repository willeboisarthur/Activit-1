const {Sequelize} = require('sequelize');

let bdd = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let connect = async () => {
    try{
        await bdd.authenticate();
        console.log("connexion à la db réussie")
    }
    catch(err){
        console.error("Erreur de la connexion à la base de donnée : ", err);
    }
}

module.exports = {connect, bdd};