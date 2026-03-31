const express = require('express');
const router = express.Router();

const { adminLogin, adminRegister } = require('../controllers/adminAuthController');
const {
    adminGetStats,
    adminGetHotels, adminGetHotel, adminCreateHotel, adminUpdateHotel, adminDeleteHotel,
    adminGetRooms, adminGetRoom, adminCreateRoom, adminUpdateRoom, adminDeleteRoom,
    adminGetBookings, adminGetBooking, adminUpdateBookingStatus, adminDeleteBooking,
    adminGetUsers, adminGetUser, adminUpdateUser, adminDeleteUser,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Auth Routes
router.post('/auth/login', adminLogin);
router.post('/auth/register', adminRegister);

// Dashboard routes (require auth)
router.get('/stats', protect, adminOnly, adminGetStats);

// Hotel Management
router.get('/hotels', protect, adminOnly, adminGetHotels);
router.post('/hotels', protect, adminOnly, adminCreateHotel);
router.get('/hotels/:id', protect, adminOnly, adminGetHotel);
router.put('/hotels/:id', protect, adminOnly, adminUpdateHotel);
router.delete('/hotels/:id', protect, adminOnly, adminDeleteHotel);

// Room Management
router.get('/rooms', protect, adminOnly, adminGetRooms);
router.post('/rooms/hotel/:hotelId', protect, adminOnly, adminCreateRoom);
router.get('/rooms/:id', protect, adminOnly, adminGetRoom);
router.put('/rooms/:id', protect, adminOnly, adminUpdateRoom);
router.delete('/rooms/:id', protect, adminOnly, adminDeleteRoom);

// Booking Management
router.get('/bookings', protect, adminOnly, adminGetBookings);
router.get('/bookings/:id', protect, adminOnly, adminGetBooking);
router.put('/bookings/:id/status', protect, adminOnly, adminUpdateBookingStatus);
router.delete('/bookings/:id', protect, adminOnly, adminDeleteBooking);

// User Management
router.get('/users', protect, adminOnly, adminGetUsers);
router.get('/users/:id', protect, adminOnly, adminGetUser);
router.put('/users/:id', protect, adminOnly, adminUpdateUser);
router.delete('/users/:id', protect, adminOnly, adminDeleteUser);

module.exports = router;
