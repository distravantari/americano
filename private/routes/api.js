const express = require('express');
const router = express.Router();

const { generateRounds } = require('../controllers/americano');

// API route to fetch users
router.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  res.json(users);
});

// Define a POST route to generate rounds
router.post('/americano/generateRounds', (req, res) => {
  const { numberOfPlayers, title, isPrivate } = req.body;
  
  // Extract players from req.body
  const totalPlayers = parseInt(numberOfPlayers, 10);
  const players = [];

  // Dynamically collect player fields from the request body
  for (let i = 1; i <= totalPlayers; i++) {
    const playerName = req.body[`player${i}`];
    if (playerName) {
      players.push(playerName);
    }
  }

  // Validate the number of players
  if (players.length < 4 || players.length > 6) {
    return res.status(400).json({ error: 'Player count must be between 4 and 6.' });
  }

  try {
    // Generate rounds based on players
    const americano = generateRounds({
      isPrivate: isPrivate,
      numberOfPlayers: numberOfPlayers,
      players,
      title,
    });

    // Send the response back to the client
    res.json({ americano });
  } catch (error) {
    console.error('Error generating rounds:', error);
    res.status(500).json({ error: 'Failed to generate rounds.' });
  }
});

module.exports = router;