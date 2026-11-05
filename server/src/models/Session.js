const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  bookedCount: { type: Number, default: 0 },
  meetingLink: String,
});

sessionSchema.index({ serviceId: 1, startsAt: 1 });

module.exports = mongoose.model('Session', sessionSchema);