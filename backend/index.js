const express = require('express');
const user = require('./routes/user');
const account = require('./routes/account');
const transaction = require('./routes/transaction');
const spaces = require('./routes/spaces');
const admin = require('./routes/admin');

const app = express();
app.use(express.json());

app.get('/service', (req, res)=>{
  res.status(200).json({"service": "backend"})
});
app.use(user);
app.use(account);
app.use(transaction);
app.use(spaces);
app.use(admin);

app.listen(3000, () => {
  console.log('APP running at http://localhost:3000');
});