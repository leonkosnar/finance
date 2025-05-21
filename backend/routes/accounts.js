const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/account', (req, res) => {
    const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(req.user);
    res.json(accounts);
});

router.get('/accounts', (req, res) => {
    const accounts = db.prepare('SELECT * FROM accounts').all();
    res.json(accounts);
});

module.exports = router;