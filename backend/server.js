// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // This matches the port in your .env file

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// === API ROUTES ===

// Example route for fetching monitoring data
app.get('/api/monitoring-data', (req, res) => {
  console.log('Received request for /api/monitoring-data');
  // In a real app, you would fetch this from a database
  const mockData = [
    { id: 1, location: 'Jaipur', hmpi: 75.5 },
    { id: 2, location: 'Delhi', hmpi: 120.2 },
  ];
  res.json(mockData);
});

// Example route for submitting citizen reports
app.post('/api/citizen-reports', (req, res) => {
  const report = req.body;
  console.log('Received citizen report:', report);
  // Here, you would save the report to a database
  res.status(201).json({ message: 'Report submitted successfully!', data: report });
});

// Example route for triggering emergency alerts
app.post('/api/emergency-alerts', (req, res) => {
  const alert = req.body;
  console.log('Triggering emergency alert:', alert);
  // Here, you would integrate with an SMS/Email service like Twilio
  res.status(200).json({ message: 'Alert triggered!', data: alert });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});