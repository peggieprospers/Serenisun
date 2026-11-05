const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: String,
  specialties: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Instructor', instructorSchema);