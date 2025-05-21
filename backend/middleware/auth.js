const db = require('../db');

function authMiddleware(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) return res.status(401).json({ error: 'Missing token' });

//   const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
//   if (!user) return res.status(403).json({ error: 'Invalid token' });

//   req.user = user;
  next();
}

module.exports = authMiddleware;