const { recommendService } = require('../services/aiService');

const httpError = (status, message) => Object.assign(new Error(message), { status });

exports.recommend = async (req, res) => {
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';

  if (description.length < 10) {
    throw httpError(400, 'Please tell us a little more about your experience and goals.');
  }
  if (description.length > 1000) {
    throw httpError(400, 'Please keep your description under 1000 characters.');
  }

  try {
    res.json(await recommendService(description));
  } catch (err) {
    console.error('AI recommendation failed:', err.message);
    throw httpError(502, 'The guide is resting right now. You can still browse and book any session.');
  }
};