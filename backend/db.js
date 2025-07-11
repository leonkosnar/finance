const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Persistent DB file
const DB_FILE = path.join(__dirname, 'database.db');
const isNew = !fs.existsSync(DB_FILE);

const db = new Database(DB_FILE);

// Create tables only if the DB is new
if (isNew) {
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      firstname TEXT,
      lastname TEXT,
      password  TEXT
    );
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT
    );
    CREATE TABLE spaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER,
      name TEXT,
      color TEXT,
      balance REAL,
      goal_balance REAL,
      is_default BOOLEAN,
      FOREIGN KEY(account_id) REFERENCES accounts(id)
    );
    CREATE TABLE rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT,
      percentage INTEGER,
      space_id INTEGER,
      FOREIGN KEY(space_id) REFERENCES spaces(id)
    );
    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY,
      first_party INTEGER,
      second_party TEXT,
      tag TEXT,
      amount REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(first_party) REFERENCES accounts(id)
    );
    CREATE TABLE system_state (
        id INTEGER PRIMARY KEY,
        key TEXT UNIQUE,
        value TEXT
    );
  `);

  // Seed user and account
  const insertUser = db.prepare('INSERT INTO users (id, username, firstname, lastname, password) VALUES (?, ?, ?, ?, ?)');
  const userInfo = insertUser.run(1, 'max', "CJ", "Bacon", 'max');

  const insertAccount = db.prepare('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)');
  const accountInfo = insertAccount.run(1, 1, "Girokonto");

  const insertSpace = db.prepare('INSERT INTO spaces (account_id, name, color, balance, goal_balance, is_default) VALUES (?, ?, ?, ?, ?, ?)');
  const spaceInfo = insertSpace.run(1, 'Space 1', '#ffaaee', 0, 0, 1);
  const spaceInfo2 = insertSpace.run(1, 'Space 2', '#ffaaef', 0, 0, 0);

  const insertTransaction = db.prepare('INSERT INTO transactions (id, first_party, second_party, tag, amount, timestamp) VALUES (?, ?, ?, ?, ?, ?)');
  const transactionInfo2 = insertTransaction.run(1, 1, 'Google', 'Gehalt', 1000, "2025-06-02T08:58:57.147Z");
  const transactionInfo = insertTransaction.run(2, 1, 'Billa', 'Essen und Trinken', -10, "2025-06-02T23:58:57.147Z");

  console.log('Database initialized with sample data.');
}

module.exports = db;