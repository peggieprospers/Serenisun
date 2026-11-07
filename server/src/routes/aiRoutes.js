const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const requireAuth = require('../middleware/auth');
const { recommend } = require('../controllers/aiController');

// Each AI call costs money, so limit how often one person can use it
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'You have asked the guide a lot just now. Please try again in a few minutes.' },
});

router.post('/recommend', requireAuth, aiLimiter, recommend);

module.exports = router;