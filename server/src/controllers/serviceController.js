const mongoose = require('mongoose');
const Service = require('../models/Service');
const Session = require('../models/Session');
require('../models/Instructor'); 

exports.listServices = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.maxDuration) filter.durationMinutes = { $lte: Number(req.query.maxDuration) };

  const services = await Service.find(filter).sort({ name: 1 });
  res.json({ services });
};

exports.getService = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  const sessions = await Session.find({ serviceId: service._id, startsAt: { $gt: new Date() } })
    .sort({ startsAt: 1 })
    .populate('instructorId', 'name');

  res.json({
    service,
    sessions: sessions.map((s) => ({
      id: s._id,
      startsAt: s.startsAt,
      endsAt: s.endsAt,
      instructor: s.instructorId ? s.instructorId.name : null,
      capacity: s.capacity,
      spotsLeft: s.capacity - s.bookedCount,
    })),
  });
};