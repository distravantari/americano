// app.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./private/routes/api');
const webhookRoutes = require('./private/routes/webhook.js');
const fs = require('fs');
const pool = require('./private/db');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const initDb = async () => {
  const query = fs.readFileSync('./private/create_tables.sql').toString();
  await pool.query(query);
  console.log('Tables created successfully.');
};

initDb().catch(err => console.error('Error initializing the database:', err.message));

// Middleware to attach pool to req
app.use((req, res, next) => {
  req.pool = pool;
  next();
});


// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/partner', webhookRoutes);

// All other routes should send back the index.html file for your front-end routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});