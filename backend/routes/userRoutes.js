const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteUser, getAdminStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
