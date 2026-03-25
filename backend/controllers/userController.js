const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc  Get user profile
// @route GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
});

// @desc  Update user profile
// @route PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ success: true, user: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role, avatar: updated.avatar, phone: updated.phone } });
});

// @desc  Get all users (admin)
// @route GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
});

// @desc  Delete user (admin)
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
});

// @desc  Admin dashboard stats
// @route GET /api/users/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalHotels, totalRooms, totalBookings, bookings] = await Promise.all([
        User.countDocuments(),
        Hotel.countDocuments(),
        Room.countDocuments(),
        Booking.countDocuments(),
        Booking.find({ status: { $ne: 'cancelled' } }).select('totalPrice'),
    ]);
    const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const recentBookings = await Booking.find().sort('-createdAt').limit(5)
        .populate('user', 'name email').populate('hotel', 'name').populate('room', 'title');
    res.json({ success: true, stats: { totalUsers, totalHotels, totalRooms, totalBookings, revenue, recentBookings } });
});

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser, getAdminStats };
