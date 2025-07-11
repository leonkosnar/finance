const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

const getBankJWT = async (username, password) => {
  const response = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (!response.ok) {
    console.debug(`login attempt by ${username} failed due to bank (${response.status})`);
    throw new Error('Bank service failed');
  }

  const loginData = await response.json();
  return loginData.token;
}

router.post('/login', async (req, res) => {
  const { username, password, bank_password } = req.body;

  const user = db.prepare('SELECT u.id, u.password, u.firstname, u.lastname FROM users u WHERE u.username = ?').get(username);
  if (!user || password !== user.password) {
    console.debug(`login attempt by ${username} failed due to invalid credentials`)
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const bank_jwt = await getBankJWT(username, bank_password);
  const token = jwt.sign({ id: user.id, bank_jwt: bank_jwt }, "secret123", { // TODO use env
    expiresIn: '1d'
  });
  console.debug(`login attempt by ${username} succeeded`);
  res.json({ token: token, firstname: user.firstname, lastname: user.lastname });
});

router.post('/signup', async (req, res) => {
  const { username, password, bank_password, firstname, lastname } = req.body;

  if (!(username && password && bank_password && firstname && lastname)) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  let user_id = 1
  try {
    const latest_user = db.prepare('SELECT id FROM users ORDER BY id LIMIT 1');
    const insertUser = db.prepare('INSERT INTO users (id, username, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)');
    user_id = latest_user.id + 1 ?? user_id;
    const userInfo = insertUser.run(user_id, username, password, firstname, lastname);
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'signup failed' });
  }

  const bank_jwt = await getBankJWT(username, bank_password);

  const token = jwt.sign({ id: user_id, bank_jwt: bank_jwt }, "secret123", { // TODO use env
    expiresIn: '1d'
  });
  console.debug(`signup attempt by ${username} succeeded`);
  res.json({ token });
});

module.exports = router;