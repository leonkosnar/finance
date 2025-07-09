const express = require('express');
const db = require('../db');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/transactions', auth, (req, res) => {
  const limit = req.query?.limit || 10;
  const offset = req.query?.offset || 0;

  const transactions = db.prepare(`
  SELECT
  t.id AS transaction_id,
  t.amount,
  t.timestamp,
  t.payment_ref,
  a_source.name AS source_name,
  a_dest.name AS destination_name
FROM
  transactions t
JOIN accounts a_source ON t.source_account = a_source.id
JOIN accounts a_dest ON t.destination_account = a_dest.id
WHERE
  a_source.user_id = ? OR a_dest.user_id = ?
  LIMIT ? 
  OFFSET ?
  `).all(req.user, req.user, limit, offset);
  res.json(transactions);
});

router.get('/transactions/debug', (req, res) => {
  const transactions = db.prepare('SELECT * FROM transactions').all();
  res.json(transactions);
});

module.exports = router;