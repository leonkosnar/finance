const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing or malformed token' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, "secret123"); //TODO use env
        req.user = payload.id;
        req.bank_jwt = payload.bank_jwt;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;