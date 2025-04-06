// backend/routes/jobberWebhooks.js

const express = require('express');
const router = express.Router();
const { createRecord, updateRecord } = require('../services/airtable');

// Middleware to validate the webhook secret
tokenAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== process.env.JOBBER_WEBHOOK_SECRET) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// Quote Created
router.post('/quote', tokenAuth, async (req, res) => {
  const data = req.body;
  try {
    await createRecord('Quotes', {
      'Quote ID': data.id,
      'Contact Email': data.client?.email || '',
      'Created Date': new Date().toISOString(),
      'Value': data.total_price || 0,
      'Notes': data.title || ''
    });
    res.status(200).send('Quote created');
  } catch (err) {
    console.error('Quote Create Error:', err);
    res.status(500).send('Error saving quote');
  }
});

// Quote Updated
router.post('/quote-updated', tokenAuth, async (req, res) => {
  const data = req.body;
  try {
    const recordId = await findRecordIdByQuoteId(data.id); // custom logic to map IDs
    await updateRecord('Quotes', recordId, {
      'Value': data.total_price,
      'Notes': data.title
    });
    res.status(200).send('Quote updated');
  } catch (err) {
    console.error('Quote Update Error:', err);
    res.status(500).send('Error updating quote');
  }
});

// Quote Deleted
router.post('/quote-deleted', tokenAuth, async (req, res) => {
  const data = req.body;
  console.log(`Quote deleted: ${data.id}`);
  res.status(200).send('Handled deletion'); // actual deletion logic optional
});

// Job Created
router.post('/job', tokenAuth, async (req, res) => {
  const data = req.body;
  try {
    await createRecord('Jobs', {
      'Job ID': data.id,
      'Status': data.status,
      'Date Created': new Date().toISOString(),
      'Assigned Rep': data.assigned_to?.full_name || ''
    });
    res.status(200).send('Job created');
  } catch (err) {
    console.error('Job Create Error:', err);
    res.status(500).send('Error saving job');
  }
});

// Job Updated
router.post('/job-updated', tokenAuth, async (req, res) => {
  const data = req.body;
  try {
    const recordId = await findRecordIdByJobId(data.id); // custom logic to map IDs
    await updateRecord('Jobs', recordId, {
      'Status': data.status
    });
    res.status(200).send('Job updated');
  } catch (err) {
    console.error('Job Update Error:', err);
    res.status(500).send('Error updating job');
  }
});

// Job Deleted
router.post('/job-deleted', tokenAuth, async (req, res) => {
  const data = req.body;
  console.log(`Job deleted: ${data.id}`);
  res.status(200).send('Handled deletion');
});

// Job Closed
router.post('/job-closed', tokenAuth, async (req, res) => {
  const data = req.body;
  try {
    const recordId = await findRecordIdByJobId(data.id); // lookup
    await updateRecord('Jobs', recordId, {
      'Status': 'Closed'
    });
    res.status(200).send('Job closed');
  } catch (err) {
    console.error('Job Close Error:', err);
    res.status(500).send('Error updating job');
  }
});

module.exports = router;
