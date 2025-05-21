const Database = require('better-sqlite3');
const db = new Database(':memory:');

// Create schema
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    token TEXT UNIQUE
  );
  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    balance REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_account INTEGER,
    destination_account INTEGER,
    amount REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed sample user and accounts
const insertUser = db.prepare('INSERT INTO users (name, token) VALUES (?, ?)');
const userInfo = insertUser.run('Alice', 'token123');

const insertAccount = db.prepare('INSERT INTO accounts (user_id, balance) VALUES (?, ?)');
insertAccount.run(userInfo.lastInsertRowid, 1000);

module.exports = db;