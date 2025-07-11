const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/account', auth, async (req, res) => {
    const accountId = req.user;
    if (!accountId) return res.status(401);
    try {
        const account = db.prepare(`
            SELECT a.id, a.user_id, SUM(t.amount) AS balance
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.first_party
            WHERE a.user_id = ?
            GROUP BY a.id
        `).get(accountId);
        const transactions = db.prepare('SELECT * FROM transactions WHERE first_party = ? LIMIT 5').all(accountId);
        const spaces = db.prepare('SELECT * FROM spaces WHERE account_id = ?').all(accountId);
        // console.log(accountId, account, transactions, spaces)
        
        if (!account) return res.status(500);
        return res.json({ account: { ...account, transactions: transactions }, spaces: spaces });
    }
    catch {
        res.status(500)
    }
});

module.exports = router;