const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    userDescription: { type: String, maxlength: 1000 }, // used later by the AI feature
    aiRecommendation: String,
    instructorNote: String,
  },
  { timestamps: true }
);

// A user can hold only ONE confirmed booking per session, but cancelled
// ones don't count, so they can rebook after cancelling.
bookingSchema.index(
  { userId: 1, sessionId: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

module.exports = mongoose.model('Booking', bookingSchema);