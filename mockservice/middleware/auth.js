const db = require('../db');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing or malformed api-key' });

    const api_key = authHeader.split(' ')[1];

    try {
        const user = db.prepare('SELECT * FROM users WHERE api_key = ?').get(api_key);
        if (!user) throw new Error('Login failed');
        req.user = user.id;
        next();
    } catch (err) {
        console.log("AUTH failed", err)
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;