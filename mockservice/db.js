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
      name TEXT,
      password  TEXT
    );
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT,
      tag TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_party INTEGER,
      second_party INTEGER,
      payment_ref TEXT,
      amount REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(first_party) REFERENCES accounts(id)
      FOREIGN KEY(second_party) REFERENCES accounts(id)
    );
  `);

  const tags = {
    TRAVEL: "Reisen",
    FOOD: "Essen und Trinken",
    CLOTHES: "Shopping",
    MEDIA: "Multimedia",
    LEASURE: "Freizeit",
    EDUCATION: "Bildung",
    ONLINE: "Online Shopping",
    TAXES: "Steuern",
    TRANSFER: "Überweisung",
    USER: "Nutzer",
    SALARY: "Gehalt",
    OTHER: "Andere",
  }

  const vendors = [
    { id: 101, name: 'FH Campus Wien', tag: tags.EDUCATION, options: [{ message: "Studienbeitrag", amt: -388.56 }] },
    { id: 102, name: 'Uni Wien', tag: tags.EDUCATION, options: [{ message: "ÖH-Beitrag", amt: -25.20 }] },
    { id: 103, name: 'Billa', tag: tags.FOOD, options: [{ message: "Danke für Ihren Einkauf", min: -5, max: -200 }] },
    { id: 104, name: 'Spar', tag: tags.FOOD, options: [{ message: "Spar dankt", min: -5, max: -200 }] },
    { id: 105, name: 'Leon', tag: tags.TRANSFER, options: [{ message: "Einkauf", min: -70, max: 70 }, { message: "Essen", min: -100, max: 100 }, { message: "Danke", min: -200, max: 200 }] },
    { id: 106, name: 'Christopher', tag: tags.TRANSFER, options: [{ message: "Eis", min: -20, max: 20 }, { message: "Schwimmen", min: -15, max: 15 }, { message: "Tank", min: -50, max: 50 }, { message: "Danke", min: -500, max: 500 }] },
    { id: 107, name: 'Finanzamt Wien', tag: tags.TAXES, options: [{ message: "Steuerrückzahlung", min: 100, max: 1000 }, { message: "Steuernachzahlung", min: -100, max: -1000 }] },
    { id: 108, name: 'Cineplexx', tag: tags.LEASURE, options: [{ message: "Viel Spaß!", min: -5, max: -30 }] },
    { id: 109, name: 'Amazon.at', tag: tags.ONLINE, options: [{ message: "Ihre Amazon AT Bestellung", min: -10, max: -100 }, { message: "Amazon AT Rückerstattung", min: 10, max: 100 }] },
    { id: 201, name: 'Goodle', tag: tags.SALARY, options: [{ message: "Ihr Gehalt für diesen Monat", min: 5000, max: 10000 }, { message: "Überstunden", min: 400, max: 10000 }] },
    { id: 202, name: 'Apple', tag: tags.SALARY, options: [{ message: "Nicht Alles auf Einmal ausgeben", min: 4000, max: 12000 }, { message: "Überstunden", min: 200, max: 8000 }] },
  ]

  let prevDate = new Date(2025, 5, 1);
  function randomDate() {
    prevDate = new Date(prevDate.getTime() + Math.random() * 100_000_000);
    return prevDate;
  }

  const getTransaction = (first_party) => {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const scenario = vendor.options[Math.floor(Math.random() * vendor.options.length)]
    // console.log(vendor?.name, scenario?.message, scenario?.amt, scenario?.min, scenario?.max)
    const amount = scenario?.amt || Math.random() * (scenario.max - scenario.min) + scenario.min

    return {
      first_party: first_party,
      second_party: vendor.id,
      amount: Math.round(amount * 100) / 100,
      message: vendor.tag,
      timestamp: randomDate().toISOString()
    }
  }

  // Seed user and account
  const insertUser = db.prepare('INSERT INTO users (id, name, password) VALUES (?, ?, ?)');
  insertUser.run(0, 'vendors', 'asdfghjkl');
  insertUser.run(1, 'max', 'max');
  insertUser.run(2, 'anna', 'anna');
  
  const insertAccount = db.prepare('INSERT INTO accounts (id, user_id, name, tag) VALUES (?, ?, ?, ?)');
  insertAccount.run(1, 1, "Girokonto", tags.USER);
  insertAccount.run(2, 2, "Girokonto", tags.USER);
  vendors.forEach(vendor => {
    insertAccount.run(vendor.id, 0, vendor.name, vendor.tag);
  })
  
  const insertTransaction = db.prepare('INSERT INTO transactions (first_party, second_party, payment_ref, amount, timestamp) VALUES (?, ?, ?, ?, ?)');
  for(let i = 0; i < 100; i++){
    const transaction = getTransaction(1)
    insertTransaction.run(transaction.first_party, transaction.second_party, transaction.message, transaction.amount, transaction.timestamp)
  }
  for(let i = 0; i < 20; i++){
    const transaction = getTransaction(2)
    insertTransaction.run(transaction.source_account, transaction.destination_account, transaction.message, transaction.amount, transaction.timestamp)
  }
  console.log('Database initialized with sample data.');
}

module.exports = db;