const axios = require('axios');
const express = require('express');
const db = require('./db');
const auth = require('./middleware/auth');


// Get last synced transaction ID
function getLastTransactionId() {
    const row = db.prepare(`SELECT value FROM system_state WHERE key = 'last_transaction_id'`).get();
    return row ? parseInt(row.value) : 0;
}
function getLastAccountId() {
    const row = db.prepare(`SELECT id FROM accounts ORDER BY id DESC LIMIT 1`).get();
    return row ? parseInt(row.id) : 0;
}

// Set new last synced transaction ID
function setLastTransactionId(id) {
    db.prepare(`
    INSERT INTO system_state (key, value)
    VALUES ('last_transaction_id', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(id.toString());
}

const sync_accounts = async () => {
    const lastId = getLastAccountId();
    const response = await axios.get(`http://localhost:3001/accounts?last_id=${lastId}`);
    const accounts = response.data;

    if (accounts.length === 0) {
        return 0;
    }

    const stmt = db.prepare(`INSERT OR IGNORE INTO accounts (id, user_id) VALUES (?, ?)`);
    const insertMany = db.transaction((accounts) => {
        for (const acc of accounts) {
            stmt.run(acc.id, acc.user_id);
        }
    });

    insertMany(accounts);

    return accounts.length
}

const sync_transactions = async() => {
    const lastId = getLastTransactionId();
    const response = await axios.get(`http://localhost:3001/transactions?last_id=${lastId}`);
    const transactions = response.data;

    if (transactions.length === 0) {
        return 0;
    }

    const insertTx = db.prepare(`
      INSERT INTO transactions (id, first_party, second_party, tag, amount, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const updateSpace = db.prepare(`
      UPDATE spaces SET balance = balance + ? WHERE id = ?
    `);

    const getRules = db.prepare(`
      SELECT r.* FROM rules r
      JOIN spaces s ON r.space_id = s.id
      WHERE s.account_id = ? AND r.tag = ?
    `);

    const getDefaultSpace = db.prepare(`
      SELECT id FROM spaces WHERE account_id = ? AND is_default = 1
    `);

    const processTransactions = db.transaction((txs) => {
        for (const tx of txs) {
            const { transaction_id, amount, timestamp, tag, first_party, second_party } = tx;

            // Only process if first_party is a known account
            const rules = getRules.all(first_party, tag);
            let remaining = amount;

            for (const rule of rules) {
                const share = amount * (rule.percentage / 100);
                updateSpace.run(share, rule.space_id);
                remaining -= share;
            }

            const defaultSpace = getDefaultSpace.get(first_party);
            if (defaultSpace) {
                updateSpace.run(remaining, defaultSpace.id);
            }

            // Insert into local transactions table
            insertTx.run(transaction_id, first_party, second_party, tag, amount, timestamp);
        }

        const maxId = Math.max(...txs.map(t => t.transaction_id));
        setLastTransactionId(maxId);
    });

    processTransactions(transactions);

    return transactions.length;
}

module.exports = {sync_accounts, sync_transactions}