const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentification requise.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { id_user, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès refusé.' });
    }
    next();
};

module.exports = { verifyToken, requireRole };