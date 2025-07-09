const express = require('express');
const login = require('./routes/login');
const accounts = require('./routes/accounts');
const transactions = require('./routes/transactions');

const app = express();
app.use(express.json());

app.get('/service', (req, res)=>{
  res.status(200).json({"service": "backend"})
});
app.use(login);
app.use(accounts);
app.use(transactions);

app.listen(3000, () => {
  console.log('APP running at http://localhost:3000');
});