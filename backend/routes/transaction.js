const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /spaces?account_id=...
 */
router.get('/transactions', auth, (req, res) => {
    const accountId = req.user;
    const limit = req.params.limit ?? 10;
    const offset = req.params.offset ?? 0;

    const transactions = db.prepare('SELECT * FROM transactions WHERE first_party = ? LIMIT ? OFFSET ?').all(accountId, limit, offset)
    if (!transactions) return res.status(500).json({ error: err.message });
    res.json(transactions);
});

module.exports = router;