const mongoose = require('mongoose');
const Session = require('../models/Session');

// An error that carries an HTTP status code
class BookingError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Takes one spot in a session. The check ("is there room?") and the change
// ("add one booking") happen in ONE database operation, so two people
// clicking at the same moment can never both get the last spot.
async function reserveSpot(sessionId) {
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new BookingError(404, 'Session not found.');
  }

  const session = await Session.findOneAndUpdate(
    {
      _id: sessionId,
      startsAt: { $gt: new Date() },
      $expr: { $lt: ['$bookedCount', '$capacity'] },
    },
    { $inc: { bookedCount: 1 } },
    { new: true }
  );
  if (session) return session;

  // The update matched nothing, so work out why and give a clear message
  const existing = await Session.findById(sessionId);
  if (!existing) throw new BookingError(404, 'Session not found.');
  if (existing.startsAt <= new Date()) throw new BookingError(400, 'That session has already started.');
  throw new BookingError(
    409,
    existing.capacity === 1 ? 'That time slot is already taken.' : 'That class is full.'
  );
}

// Gives a spot back, for example after a cancellation
async function releaseSpot(sessionId) {
  await Session.updateOne(
    { _id: sessionId, bookedCount: { $gt: 0 } },
    { $inc: { bookedCount: -1 } }
  );
}

module.exports = { BookingError, reserveSpot, releaseSpot };