require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());          // lets the React app call this server
app.use(express.json());  // lets the server read JSON request bodies

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));