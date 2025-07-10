const express = require('express');
const db = require('../db');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/transactions', auth, (req, res) => {
  const limit = req.query?.limit || 10;
  const offset = req.query?.offset || 0;
  const last_id = req.query?.last_id || 0;

  const statement = [`
  SELECT
  t.id AS transaction_id,
  t.amount,
  t.timestamp,
  t.payment_ref as tag,
  t.first_party,
  a_dest.name AS second_party
  FROM
  transactions t
  JOIN accounts a_source ON t.first_party = a_source.id
  JOIN accounts a_dest ON t.second_party = a_dest.id
  WHERE
  t.first_party = ? OR t.second_party = ?
  LIMIT ? 
  OFFSET ?
  `].join("");

  console.debug(statement)

  const transactions = db.prepare(statement).all(req.user, req.user, limit, offset);
  res.json(transactions);
});

router.get('/transactions/debug', (req, res) => {
  const transactions = db.prepare('SELECT * FROM transactions').all();
  res.json(transactions);
});

module.exports = router;