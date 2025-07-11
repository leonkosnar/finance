const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /spaces?account_id=...
 */
router.get('/transactions', auth, (req, res) => {
    const accountId = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const transactions = db
            .prepare('SELECT * FROM transactions WHERE first_party = ? LIMIT ? OFFSET ?')
            .all(accountId, limit, offset);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;