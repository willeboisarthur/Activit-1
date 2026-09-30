const {bdd} = require('./connexion.js');
const product = require('../models/product_model.js');

const sync = async () => {
    await bdd.sync();
}

module.exports = sync;