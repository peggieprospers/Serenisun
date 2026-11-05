module.exports = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'You have already booked this session.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};