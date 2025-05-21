const express = require('express');
const auth = require('./middleware/auth');
const accounts = require('./routes/accounts');
const transfer = require('./routes/transfer');

const app = express();
app.use(express.json());
app.use(auth); // apply to all routes

app.use(accounts);
app.use(transfer);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bank API running on http://localhost:${PORT}`);
});