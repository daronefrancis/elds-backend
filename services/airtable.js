// /services/airtable.js

const axios = require('axios');
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_TOKEN;
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// Generic fetcher for a table
async function getRecords(table, filter = "") {
  try {
    const res = await axios.get(`${API_URL}/${table}${filter}`, { headers });
    return res.data.records;
  } catch (err) {
    console.error(`[Airtable] Fetch Error from ${table}:`, err.message);
    return [];
  }
}

// Generic creator for a table
async function createRecord(table, fields) {
  try {
    const res = await axios.post(`${API_URL}/${table}`, {
      fields
    }, { headers });
    return res.data;
  } catch (err) {
    console.error(`[Airtable] Create Error in ${table}:`, err.message);
    return null;
  }
}

// Generic updater
async function updateRecord(table, id, fields) {
  try {
    const res = await axios.patch(`${API_URL}/${table}/${id}`, {
      fields
    }, { headers });
    return res.data;
  } catch (err) {
    console.error(`[Airtable] Update Error in ${table}/${id}:`, err.message);
    return null;
  }
}

module.exports = {
  getRecords,
  createRecord,
  updateRecord
};
