const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

const { generateRounds } = require('../controllers/americano');

// API route to fetch users
router.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  res.json(users);
});

// Define a POST route to generate rounds
router.post('/americano/generateRounds', (req, res) => {
  const { numberOfPlayers, title, isPrivate, community } = req.body;
  
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
      community,
    });

    // Send the response back to the client
    res.json({ americano });
  } catch (error) {
    console.error('Error generating rounds:', error);
    res.status(500).json({ error: 'Failed to generate rounds.' });
  }
});

router.get('/screenshot/:gameID', async (req, res) => {
  const { gameID } = req.params;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#!/americano-game/'+gameID); // Replace with your game page URL

  // Capture a screenshot of the full page
  const screenshot = await page.screenshot({ fullPage: true });

  await browser.close();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'attachment; filename=americanogame.png');
  res.send(screenshot);
});

router.post('/game-standing', async (req, res) => {
  const { game, data, community, isPrivate } = req.body;

  // Validate input
  if (!game || !data || !Array.isArray(data) || !community || typeof isPrivate !== 'boolean') {
      return res.status(400).send('Invalid input');
  }

  try {
      // Insert the data into the database
      const result = await req.pool.query(
          'INSERT INTO "game-standing" (game, data, community, isPrivate) VALUES ($1, $2, $3, $4) RETURNING *',
          [game, JSON.stringify(data), community, isPrivate]
      );

      res.status(201).json(result.rows[0]); // Return the inserted row
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

router.delete('/game-standing', async (req, res) => {
  const { community } = req.body;

  // Validate input
  if (!community) {
      return res.status(400).send('Invalid input: community is required');
  }

  try {
      // Delete the data from the database
      const result = await req.pool.query(
          'DELETE FROM "game-standing" WHERE community = $1 RETURNING *',
          [community]
      );

      if (result.rowCount === 0) {
          return res.status(404).send('No records found for the specified community');
      }

      res.status(200).json({
          message: `${result.rowCount} record(s) deleted`,
          deletedRows: result.rows
      }); // Return the number of deleted rows and the details of the deleted records
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// GET route for fetching game standings
router.get('/game-standing', async (req, res) => {
  try {
      // const result = await req.pool.query('SELECT * FROM "game-standing"');
      const result = await req.pool.query('SELECT * FROM "game-standing" WHERE isprivate = false');
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;