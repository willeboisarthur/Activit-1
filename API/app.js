const express = require('express');
const { connect } = require('./database/connexion');
const sync = require('./database/sync');

const productRouter = require('./routes/product_router');

const app = express();
app.use(express.json());

app.use('/', productRouter);

const database = async () => {
    await connect();
    await sync();
};

database();

module.exports = app;