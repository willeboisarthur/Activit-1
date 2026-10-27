const User = require('../models/user_model');
const { hashPassword } = require('../utils/password');

exports.create = async (req,res,next) => {
    try{
        const { username, password, role } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis'});
        }

        const existingUser = await User.findOne({ where: { username } });
        if(existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà'});
        }

        const verifyRole = ['admin', 'user'];
        if(!verifyRole.includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide'});
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    }
    catch(err){
        next(err);
    }
}

exports.update = async (req, res, next) => {
    try {

        const data = {};

        // Champs autorisés
        if (req.body.username !== undefined) {
            data.username = req.body.username;
        }

        if (req.body.role !== undefined) {
            data.role = req.body.role;
        }

        if (req.body.password !== undefined) {
            data.password = await hashPassword(req.body.password);
        }

        await User.update(data, {
            where: {
                id_user: req.params.id
            }
        });

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json({
            id_user: user.id_user,
            username: user.username,
            role: user.role
        });

    } catch (err) {
        next(err);
    }
};


exports.delete = async (req, res, next) => {
    try {

        const deleted = await User.destroy({
            where: {
                id_user: req.params.id
            }
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json({
            message: "Utilisateur supprimé."
        });

    } catch (err) {
        next(err);
    }
};

exports.getById = async (req,res,next) => {
    try{
        let user = await User.findByPk(req.params.id);
        res.status(200).json({user});
    }
    catch(err){
        next(err);
    }
}