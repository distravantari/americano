// app.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./private/routes/api');
const webhookRoutes = require('./private/routes/webhook.js');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

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