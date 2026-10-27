const Bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return Bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
}

const comparePassword = (password, hash) => {
    return Bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
}