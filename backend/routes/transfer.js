const express = require('express');
const db = require('../db');
const router = express.Router();

// TODO adapt to use mock service

router.post('/transfer', (req, res) => {
  const { source_account, destination_account, amount } = req.body;
  if (!source_account || !destination_account || !amount) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const src = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?')
                .get(source_account, req.user.id);
  const dest = db.prepare('SELECT * FROM accounts WHERE id = ?').get(destination_account);

  if (!src) return res.status(404).json({ error: 'Source account not found or unauthorized' });
  if (!dest) return res.status(404).json({ error: 'Destination account not found' });
  if (src.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  const tx = db.transaction(() => {
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amount, source_account);
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, destination_account);
    db.prepare('INSERT INTO transactions (source_account, destination_account, amount) VALUES (?, ?, ?)')
      .run(source_account, destination_account, amount);
  });

  tx();

  res.json({ message: 'Transfer successful' });
});

module.exports = router;