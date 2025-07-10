const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/account', auth, (req, res) => {
    const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(req.user);
    console.debug(`accessing account `)
    res.json(accounts);
});

router.get('/accounts', (req, res) => {
    const accounts = db.prepare('SELECT * FROM accounts').all();
    res.json(accounts);
});

module.exports = router;