const asyncHandler = require('express-async-handler');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
//  DASHBOARD STATS
// ─────────────────────────────────────────────────────────────

/**
 * @desc    Admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Admin
 */
const adminGetStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalHotels, totalRooms, totalBookings, bookings] = await Promise.all([
        User.countDocuments(),
        Hotel.countDocuments(),
        Room.countDocuments(),
        Booking.countDocuments(),
        Booking.find({ status: { $ne: 'cancelled' } }).select('totalPrice'),
    ]);

    const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const recentBookings = await Booking.find()
        .sort('-createdAt')
        .limit(5)
        .populate('user', 'name email')
        .populate('hotel', 'name')
        .populate('room', 'title');

    res.json({
        success: true,
        stats: { totalUsers, totalHotels, totalRooms, totalBookings, revenue, recentBookings },
    });
});

// ─────────────────────────────────────────────────────────────
//  HOTELS CRUD
// ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all hotels
 * @route   GET /api/admin/hotels
 * @access  Admin
 */
const adminGetHotels = asyncHandler(async (req, res) => {
    const hotels = await Hotel.find().sort('-createdAt').populate('rooms', 'price roomType');
    res.json({ success: true, count: hotels.length, hotels });
});

/**
 * @desc    Get single hotel
 * @route   GET /api/admin/hotels/:id
 * @access  Admin
 */
const adminGetHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('rooms');
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    res.json({ success: true, hotel });
});

/**
 * @desc    Create hotel
 * @route   POST /api/admin/hotels
 * @access  Admin
 */
const adminCreateHotel = asyncHandler(async (req, res) => {
    const { name, description, location, images, rating, amenities, featured, cheapestPrice } = req.body;

    if (!name || !description || !location?.city || !location?.address) {
        res.status(400);
        throw new Error('name, description, location.city and location.address are required');
    }

    const hotel = await Hotel.create({ name, description, location, images, rating, amenities, featured, cheapestPrice });
    res.status(201).json({ success: true, message: 'Hotel created', hotel });
});

/**
 * @desc    Update hotel
 * @route   PUT /api/admin/hotels/:id
 * @access  Admin
 */
const adminUpdateHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    res.json({ success: true, message: 'Hotel updated', hotel });
});

/**
 * @desc    Delete hotel (also deletes associated rooms)
 * @route   DELETE /api/admin/hotels/:id
 * @access  Admin
 */
const adminDeleteHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    await Room.deleteMany({ hotel: hotel._id });
    await hotel.deleteOne();
    res.json({ success: true, message: 'Hotel and associated rooms deleted' });
});

// ─────────────────────────────────────────────────────────────
//  ROOMS CRUD
// ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all rooms
 * @route   GET /api/admin/rooms
 * @access  Admin
 */
const adminGetRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find().sort('-createdAt').populate('hotel', 'name location');
    res.json({ success: true, count: rooms.length, rooms });
});

/**
 * @desc    Get single room
 * @route   GET /api/admin/rooms/:id
 * @access  Admin
 */
const adminGetRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id).populate('hotel', 'name location');
    if (!room) { res.status(404); throw new Error('Room not found'); }
    res.json({ success: true, room });
});

/**
 * @desc    Create room for a hotel
 * @route   POST /api/admin/rooms/hotel/:hotelId
 * @access  Admin
 */
const adminCreateRoom = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }

    const { title, description, price, maxGuests, roomType, amenities, images } = req.body;

    if (!title || !description || !price) {
        res.status(400);
        throw new Error('title, description and price are required');
    }

    const room = await Room.create({
        hotel: req.params.hotelId,
        title, description, price, maxGuests, roomType, amenities, images,
    });

    hotel.rooms.push(room._id);
    if (!hotel.cheapestPrice || room.price < hotel.cheapestPrice) hotel.cheapestPrice = room.price;
    await hotel.save();

    res.status(201).json({ success: true, message: 'Room created', room });
});

/**
 * @desc    Update room
 * @route   PUT /api/admin/rooms/:id
 * @access  Admin
 */
const adminUpdateRoom = asyncHandler(async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) { res.status(404); throw new Error('Room not found'); }
    res.json({ success: true, message: 'Room updated', room });
});

/**
 * @desc    Delete room
 * @route   DELETE /api/admin/rooms/:id
 * @access  Admin
 */
const adminDeleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) { res.status(404); throw new Error('Room not found'); }
    await Hotel.findByIdAndUpdate(room.hotel, { $pull: { rooms: room._id } });
    await room.deleteOne();
    res.json({ success: true, message: 'Room deleted' });
});

// ─────────────────────────────────────────────────────────────
//  BOOKINGS MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Admin
 */
const adminGetBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .sort('-createdAt')
        .populate('user', 'name email')
        .populate('hotel', 'name')
        .populate('room', 'title price');
    res.json({ success: true, count: bookings.length, bookings });
});

/**
 * @desc    Get single booking
 * @route   GET /api/admin/bookings/:id
 * @access  Admin
 */
const adminGetBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('hotel', 'name location')
        .populate('room', 'title price roomType');
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    res.json({ success: true, booking });
});

/**
 * @desc    Update booking status / payment status
 * @route   PUT /api/admin/bookings/:id/status
 * @access  Admin
 */
const adminUpdateBookingStatus = asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];

    if (status && !validStatuses.includes(status)) {
        res.status(400); throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
        res.status(400); throw new Error(`Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}`);
    }

    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
        { new: true }
    );
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    res.json({ success: true, message: 'Booking status updated', booking });
});

/**
 * @desc    Delete booking
 * @route   DELETE /api/admin/bookings/:id
 * @access  Admin
 */
const adminDeleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted' });
});

// ─────────────────────────────────────────────────────────────
//  USERS MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const adminGetUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
});

/**
 * @desc    Get single user
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
const adminGetUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, user });
});

/**
 * @desc    Update user role or details
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
const adminUpdateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, role, avatar } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (avatar) user.avatar = avatar;

    const updated = await user.save();
    res.json({
        success: true,
        message: 'User updated',
        user: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone, avatar: updated.avatar },
    });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const adminDeleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
});

module.exports = {
    adminGetStats,
    adminGetHotels, adminGetHotel, adminCreateHotel, adminUpdateHotel, adminDeleteHotel,
    adminGetRooms, adminGetRoom, adminCreateRoom, adminUpdateRoom, adminDeleteRoom,
    adminGetBookings, adminGetBooking, adminUpdateBookingStatus, adminDeleteBooking,
    adminGetUsers, adminGetUser, adminUpdateUser, adminDeleteUser,
};
