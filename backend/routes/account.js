const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/account', auth, async (req, res) => {
    const accountId = req.user;
    try{
        const account = db.prepare('SELECT a.balance, count(s.name) as spaces FROM accounts a JOIN spaces s on a.id = s.account_id WHERE a.user_id = ?').get(accountId);
        const transactions = db.prepare('SELECT * FROM transactions WHERE first_party = ? LIMIT 5').all(accountId);
        if (!account) return res.status(500);
        res.json({account:account, transactions:transactions});
    }
    catch{
        res.status(500)
    }
});

module.exports = router;