const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE name = ?').get(username);

  if (!user || password !== user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, "other_secret123", {
    expiresIn: '1d'
  });

  res.json({ token });
});

module.exports = router;