const express = require('express');
const login = require('./routes/login');
const accounts = require('./routes/accounts');
const transfer = require('./routes/transfer');

const app = express();
app.use(express.json());

app.get('/service', (req, res)=>{
  res.status(200).json({"service": "super bank api"})
});
app.use(login);
app.use(accounts);
app.use(transfer);

app.listen(3000, () => {
  console.log('BANK running at http://localhost:3000');
});