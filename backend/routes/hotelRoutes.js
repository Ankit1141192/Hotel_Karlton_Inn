const express = require('express');
const router = express.Router();
const { getHotels, getHotel, createHotel, updateHotel, deleteHotel, getFeaturedHotels } = require('../controllers/hotelController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedHotels);
router.get('/', getHotels);
router.get('/:id', getHotel);
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

module.exports = router;
