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
      username TEXT,
      password  TEXT
    );
  `);

  // Seed user and account
  const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const userInfo = insertUser.run('alice', 'password');

  console.log('Database initialized with sample data.');
}

module.exports = db;