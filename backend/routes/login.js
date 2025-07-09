const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password, bank_password } = req.body;

  // {"username": "alice", "password": "password", "bank_password": "pw123"}

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || password !== user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const response = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user.username,
      password: bank_password
    })
  });

  if (!response.ok) {
    console.error("BANK service failed", response.status, response)
    throw new Error('Bank service failed');
  }

  const loginData = await response.json();
  const bank_jwt = loginData.token;

  const token = jwt.sign({ id: user.id, bank_jwt: bank_jwt }, "secret123", { // TODO use env
    expiresIn: '1d'
  });

  res.json({ token });
});

module.exports = router;