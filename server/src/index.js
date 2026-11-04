require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.error('Server failed to start:', err.message);
      process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
  });
});