const express = require('express');
const { connect } = require('./database/connexion');
const sync = require('./database/sync');

const productRouter = require('./routes/product_router');
const userRouter = require('./routes/user_router');
const authRouter = require('./routes/auth_routes');

const { verifyToken } = require('./middleware/auth_middleware.js');

const app = express();
app.use(express.json());

app.use('/product', verifyToken, productRouter);
app.use('/user', verifyToken, userRouter);
app.use('/auth', authRouter);

const database = async () => {
    await connect();
    await sync();
};

database();

module.exports = app;