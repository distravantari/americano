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

router.post('/game-standing', async (req, res) => {
  const { game, data, community, isPrivate } = req.body;

  // Validate input
  if (!game || !data || !Array.isArray(data) || !community || typeof isPrivate !== 'boolean') {
      return res.status(400).send('Invalid input');
  }

  try {
      // Insert the data into the database
      const result = await req.pool.query(
          'INSERT INTO "game-standing" (game, data, community, isPrivate, createdAt) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
          [game, JSON.stringify(data), community, isPrivate]
      );

      res.status(201).json(result.rows[0]); // Return the inserted row
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// PATCH route for updating the isPrivate field for a specific game standing
router.patch('/game-standing/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the URL params
  const { isPrivate } = req.body; // Get the isPrivate value from the request body

  // Validate input
  if (typeof isPrivate !== 'boolean') {
    return res.status(400).send('Invalid input, isPrivate must be a boolean');
  }

  try {
    // Update the isPrivate field in the database for the specific id
    const result = await req.pool.query(
      'UPDATE "game-standing" SET isPrivate = $1 WHERE id = $2 RETURNING *',
      [isPrivate, id]
    );

    // If no rows were affected, return a 404 Not Found error
    if (result.rows.length === 0) {
      return res.status(404).send('Game standing not found');
    }

    res.status(200).json(result.rows[0]); // Return the updated row
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
router.get('/game-standing/:id?', async (req, res) => {
  const { id } = req.params; // Get the id parameter from the URL if it exists
  const { community } = req.query; // Get the community parameter from the query string

  try {
    let query;
    let values = [];

    // Build query based on whether id and/or community is provided
    if (id) {
      // If an id is provided, fetch data for that specific id
      query = 'SELECT * FROM "game-standing" WHERE id = $1';
      values = [id];
    } else if (community) {
      // If no id but a community is provided, fetch data for that specific community
      query = 'SELECT * FROM "game-standing" WHERE community = $1 AND isprivate = false';
      values = [community];
    } else {
      // If neither id nor community is provided, fetch all public data
      query = 'SELECT * FROM "game-standing" WHERE isprivate = false';
    }

    const result = await req.pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;