const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/account', auth, async (req, res) => {
    const accountId = req.user;
    if (!accountId) return res.status(401).send();
    try {
        const account = db.prepare(`
            SELECT a.id, a.name, a.user_id, SUM(t.amount) AS balance, a.category_max
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.first_party
            WHERE a.user_id = ?
            GROUP BY a.id
        `).get(accountId);
        const transactions = db.prepare('SELECT * FROM transactions WHERE first_party = ? LIMIT 5').all(accountId);
        const stats = db.prepare('SELECT t.tag, sum(t.amount) as volume FROM transactions t WHERE first_party = ? GROUP BY t.tag').all(accountId);
        const spaces = db.prepare('SELECT * FROM spaces WHERE account_id = ?').all(accountId);
        // console.log(accountId, account, transactions, spaces)

        if (!account) return res.status(500).send();
        return res.json({ account: { ...account, category_max: JSON.parse(account.category_max), stats: stats, transactions: transactions }, spaces: spaces });
    }
    catch {
        res.status(500).send()
    }
});

router.post('/budgets', auth, async (req, res) => {
    const accountId = req.user;
    const { categories } = req.body;
    if (!accountId) return res.status(401).send();
    if (!categories) return res.status(400).send();

    console.log(JSON.stringify(categories), accountId)

    try {
        const account = db.prepare(`UPDATE accounts SET category_max = ? WHERE id = ?`).run(JSON.stringify(categories), accountId);
        if (!account.changes) return res.status(404);
        return res.status(200).send();
    }
    catch {
        return res.status(500).send()
    }
});

module.exports = router;