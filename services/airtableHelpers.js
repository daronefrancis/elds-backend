// backend/services/airtableHelpers.js

const axios = require('axios');

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_TOKEN;
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// 🔍 Find Airtable record ID for a quote by its Jobber ID
async function findRecordIdByQuoteId(quoteId) {
  try {
    const res = await axios.get(`${API_URL}/Quotes?filterByFormula={Quote ID}='${quoteId}'`, { headers });
    const records = res.data.records;
    if (records.length > 0) {
      return records[0].id;
    } else {
      console.warn(`No matching quote found for ID ${quoteId}`);
      return null;
    }
  } catch (err) {
    console.error(`Airtable lookup failed for Quote ID ${quoteId}:`, err.message);
    return null;
  }
}

// 🔍 Find Airtable record ID for a job by its Jobber ID
async function findRecordIdByJobId(jobId) {
  try {
    const res = await axios.get(`${API_URL}/Jobs?filterByFormula={Job ID}='${jobId}'`, { headers });
    const records = res.data.records;
    if (records.length > 0) {
      return records[0].id;
    } else {
      console.warn(`No matching job found for ID ${jobId}`);
      return null;
    }
  } catch (err) {
    console.error(`Airtable lookup failed for Job ID ${jobId}:`, err.message);
    return null;
  }
}

module.exports = {
  findRecordIdByQuoteId,
  findRecordIdByJobId
};
