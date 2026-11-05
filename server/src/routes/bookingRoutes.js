const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {
  createBooking,
  listMyBookings,
  cancelBooking,
  rescheduleBooking,
} = require('../controllers/bookingController');

router.use(requireAuth); // every booking route requires login

router.post('/', createBooking);
router.get('/', listMyBookings);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id', rescheduleBooking);

module.exports = router;