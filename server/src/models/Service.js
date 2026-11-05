const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['yoga', 'meditation'], required: true },
  type: { type: String, enum: ['group', 'one-on-one'], required: true },
  durationMinutes: { type: Number, required: true },
  description: { type: String, required: true },
  isOnline: { type: Boolean, default: true },
});

module.exports = mongoose.model('Service', serviceSchema);