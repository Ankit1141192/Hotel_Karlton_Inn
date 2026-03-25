const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc  Create booking
// @route POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
    const { hotel, room, checkIn, checkOut, guests, specialRequests } = req.body;
    const roomDoc = await Room.findById(room);
    if (!roomDoc) { res.status(404); throw new Error('Room not found'); }

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    if (nights <= 0) { res.status(400); throw new Error('Invalid dates'); }
    const totalPrice = nights * roomDoc.price;

    const booking = await Booking.create({
        user: req.user._id, hotel, room, checkIn: ci, checkOut: co, guests, totalPrice, specialRequests,
    });

    // Mark dates unavailable
    const dates = [];
    for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) dates.push(new Date(d));
    await Room.findByIdAndUpdate(room, { $push: { unavailableDates: { $each: dates } } });
    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });

    res.status(201).json({ success: true, booking });
});

// @desc  Get user's bookings
// @route GET /api/bookings/my
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('hotel', 'name images location')
        .populate('room', 'title price roomType images')
        .sort('-createdAt');
    res.json({ success: true, bookings });
});

// @desc  Get single booking
// @route GET /api/bookings/:id
const getBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('hotel', 'name images location')
        .populate('room', 'title price roomType images')
        .populate('user', 'name email');
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Access denied');
    }
    res.json({ success: true, booking });
});

// @desc  Cancel booking (user)
// @route PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Access denied');
    }
    if (booking.status === 'cancelled') { res.status(400); throw new Error('Already cancelled'); }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
});

// @desc  Get all bookings (admin)
// @route GET /api/bookings
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('hotel', 'name')
        .populate('room', 'title price')
        .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
});

// @desc  Update booking status (admin)
// @route PUT /api/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
        { new: true }
    );
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    res.json({ success: true, booking });
});

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking, getAllBookings, updateBookingStatus };
