const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { hashPassword, comparePassword } = require('../utils/password');

const generateToken = (user) => {return jwt.sign({ id_user:user.id_user, role:user.role }, process.env.JWT_SECRET,{ expiresIn:'5min' })};

const register = async (req, res, next) => {
    try{
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis'});
        }

        const existingUser = await User.findOne({ where: { username } });
        if(existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà'});
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } 
    catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try{
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis'});
        }

        const user = await User.findOne({ where: { username } });
        if(!user) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'});
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'});
        }
        const token = generateToken(user);
        res.status(200).json({ message: 'Connexion réussie', token });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {register, login};