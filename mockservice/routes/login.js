const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE name = ?').get(username);

  if (!user || password !== user.password) {
    console.debug(user, password, user.password, password == user.password)
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, "secret321", { // TODO use env
    expiresIn: '1d'
  });

  res.json({ token:token });
});

module.exports = router;