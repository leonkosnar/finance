const express = require('express');
const user = require('./routes/user');
const account = require('./routes/account');
const transaction = require('./routes/transaction');
const spaces = require('./routes/spaces');
const admin = require('./routes/admin');

const { sync_accounts, sync_transactions } = require('./syncDB');


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

setTimeout(async()=>{
  const acc = await sync_accounts();
  const tra = await sync_transactions();

  console.debug(`fetched ${acc} new accounts and ${tra} new transactions`)
}, 5000)

app.listen(3000, () => {
  console.log('APP running at http://localhost:3000');
});