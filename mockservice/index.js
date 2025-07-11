const express = require('express');
const login = require('./routes/login');
const accounts = require('./routes/accounts');
const transactions = require('./routes/transactions');

const app = express();
app.use(express.json());

app.get('/service', (req, res)=>{
  res.status(200).json({"service": "super bank api"})
});
app.use(login);
app.use(accounts);
app.use(transactions);

app.listen(3001, () => {
  console.log('BANK running at http://localhost:3001');
});