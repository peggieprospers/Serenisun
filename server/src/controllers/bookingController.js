const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Session = require('../models/Session');
const { BookingError, reserveSpot, releaseSpot } = require('../services/bookingService');

const clean = (value, max) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined;

exports.createBooking = async (req, res) => {
 const { sessionId, userDescription, aiRecommendation, instructorNote } = req.body;
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new BookingError(400, 'A valid sessionId is required.');
  }

  const already = await Booking.findOne({ userId: req.user.id, sessionId, status: 'confirmed' });
  if (already) throw new BookingError(409, 'You have already booked this session.');

  await reserveSpot(sessionId);

  try {
   const booking = await Booking.create({
  userId: req.user.id,
  sessionId,
  userDescription: clean(userDescription, 1000),
  aiRecommendation: clean(aiRecommendation, 500),
  instructorNote: clean(instructorNote, 800),
});
    res.status(201).json({ booking });
  } catch (err) {
    await releaseSpot(sessionId); // give the spot back if saving failed
    throw err;
  }
};

exports.listMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate({
      path: 'sessionId',
      populate: [
        { path: 'serviceId', select: 'name category type durationMinutes' },
        { path: 'instructorId', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 });
  res.json({ bookings });
};

exports.cancelBooking = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new BookingError(404, 'Booking not found.');
  }

  // Filtering on userId means people can only cancel their OWN bookings
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id, status: 'confirmed' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) throw new BookingError(404, 'Booking not found.');

  await releaseSpot(booking.sessionId);
  res.json({ booking });
};

exports.rescheduleBooking = async (req, res) => {
  const newSessionId = req.body.sessionId;
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(newSessionId)) {
    throw new BookingError(400, 'A valid booking and new sessionId are required.');
  }

  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id, status: 'confirmed' });
  if (!booking) throw new BookingError(404, 'Booking not found.');

  const oldSession = await Session.findById(booking.sessionId);
  const newSession = await Session.findById(newSessionId);
  if (!oldSession || !newSession) throw new BookingError(404, 'Session not found.');
  if (oldSession.startsAt <= new Date()) throw new BookingError(400, 'Past sessions cannot be changed.');
  if (String(oldSession._id) === String(newSession._id)) {
    throw new BookingError(400, 'You are already booked into that session.');
  }
  if (String(oldSession.serviceId) !== String(newSession.serviceId)) {
    throw new BookingError(400, 'You can only reschedule to another time for the same service.');
  }

  const clash = await Booking.findOne({ userId: req.user.id, sessionId: newSessionId, status: 'confirmed' });
  if (clash) throw new BookingError(409, 'You have already booked that session.');

  await reserveSpot(newSessionId); // take the new spot first, so you never lose your old one

  try {
    booking.sessionId = newSessionId;
    await booking.save();
  } catch (err) {
    await releaseSpot(newSessionId);
    throw err;
  }

  await releaseSpot(oldSession._id);
  res.json({ booking });
};