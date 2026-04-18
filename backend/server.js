const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Task 4 Server is Running' });
});

// Database connection (XAMPP Default)
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'beautify petals_db'
});

db.connect((err) => {
  if (err) {
    console.error('⚠️ Error connecting to MySQL database:', err.message);
    return;
  }
  console.log('✅ Task 4 Backend: Connected to MySQL database.');
});

// --- TASK 4 ENDPOINTS (Expense Tracker) ---
app.get('/transactions', (req, res) => {
  console.log('📬 GET /transactions request received');
  const query = 'SELECT * FROM transactions ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching transactions:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Successfully fetched ${results.length} transactions`);
    res.json(results);
  });
});

app.get('/insight', (req, res) => {
  console.log('📬 GET /insight request received');
  const query = 'SELECT * FROM insight ORDER BY date DESC, created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching insights:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Successfully fetched ${results.length} insights`);
    res.json(results);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Task 4 Server running on http://192.168.1.107:${port}`);
});
