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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      password  TEXT
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

  // Seed user and account
  const insertUser = db.prepare('INSERT INTO users (name, password) VALUES (?, ?)');
  const userInfo = insertUser.run('Alice', 'password');

  const insertAccount = db.prepare('INSERT INTO accounts (user_id, balance) VALUES (?, ?)');
  insertAccount.run(userInfo.lastInsertRowid, 1000);
  insertAccount.run(userInfo.lastInsertRowid, 500); // Add a second account for transfer testing

  console.log('Database initialized with sample data.');
}

module.exports = db;