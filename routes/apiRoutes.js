// backend/routes/apiRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_TOKEN;
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// GET /api/quotes
router.get('/quotes', async (req, res) => {
  try {
    const result = await axios.get(`${API_URL}/Quotes`, { headers });
    res.json(result.data.records);
  } catch (err) {
    console.error('Failed to fetch quotes:', err.message);
    res.status(500).send('Error fetching quotes');
  }
});

// GET /api/jobs
router.get('/jobs', async (req, res) => {
  try {
    const result = await axios.get(`${API_URL}/Jobs`, { headers });
    res.json(result.data.records);
  } catch (err) {
    console.error('Failed to fetch jobs:', err.message);
    res.status(500).send('Error fetching jobs');
  }
});

module.exports = router;
