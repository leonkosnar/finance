const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log(req)
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE name = ?').get(username);

  if (!user || password !== user.password) {
    return res.status(401).json({ error: 'Invalid credentials 2' });
  }

  const token = jwt.sign({ id: user.id }, "secret321", { // TODO use env
    expiresIn: '1d'
  });

  res.json({ token:token });
});

module.exports = router;