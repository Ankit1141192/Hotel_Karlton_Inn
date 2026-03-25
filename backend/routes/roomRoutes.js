const express = require('express');
const router = express.Router();
const { getRoomsByHotel, getRoom, checkAvailability, createRoom, updateRoom, deleteRoom, getAllRooms } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllRooms);
router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoom);
router.get('/:id/availability', checkAvailability);
router.post('/hotel/:hotelId', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;
