const axios = require('axios');
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const { sync_accounts, sync_transactions } = require('../syncDB');

const router = express.Router();

// Fetch new accounts (optional)
router.post('/sync/accounts', async (req, res) => {
    // youd normaly only allow admin or system user

    try {
        const count = await sync_accounts()
        res.send(`synced ${count} new accounts from bank service`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch and process new transactions
router.post('/sync/transactions', async (req, res) => {
    // youd normaly only allow admin or system user

    try {
        const count = await sync_transactions();
        res.send(`synced ${count} new transactions from bank service`);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to sync transactions' });
    }
});

module.exports = router;