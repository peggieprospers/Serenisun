require('dotenv').config();
require('./models'); // load every model once so populate() always works
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler); // must come after all the routes

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