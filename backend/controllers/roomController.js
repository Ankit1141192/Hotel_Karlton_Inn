const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc  Get rooms for a hotel
// @route GET /api/rooms/hotel/:hotelId
const getRoomsByHotel = asyncHandler(async (req, res) => {
    const rooms = await Room.find({ hotel: req.params.hotelId });
    res.json({ success: true, rooms });
});

// @desc  Get single room
// @route GET /api/rooms/:id
const getRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id).populate('hotel', 'name location');
    if (!room) { res.status(404); throw new Error('Room not found'); }
    res.json({ success: true, room });
});

// @desc  Check room availability
// @route GET /api/rooms/:id/availability?checkIn=&checkOut=
const checkAvailability = asyncHandler(async (req, res) => {
    const { checkIn, checkOut } = req.query;
    const room = await Room.findById(req.params.id);
    if (!room) { res.status(404); throw new Error('Room not found'); }

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const unavailable = room.unavailableDates.some(date => {
        const d = new Date(date);
        return d >= ci && d < co;
    });
    res.json({ success: true, available: !unavailable });
});

// @desc  Create room (admin)
// @route POST /api/rooms/hotel/:hotelId
const createRoom = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    const room = await Room.create({ ...req.body, hotel: req.params.hotelId });
    hotel.rooms.push(room._id);
    if (!hotel.cheapestPrice || room.price < hotel.cheapestPrice) hotel.cheapestPrice = room.price;
    await hotel.save();
    res.status(201).json({ success: true, room });
});

// @desc  Update room (admin)
// @route PUT /api/rooms/:id
const updateRoom = asyncHandler(async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) { res.status(404); throw new Error('Room not found'); }
    res.json({ success: true, room });
});

// @desc  Delete room (admin)
// @route DELETE /api/rooms/:id
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) { res.status(404); throw new Error('Room not found'); }
    await Hotel.findByIdAndUpdate(room.hotel, { $pull: { rooms: room._id } });
    await room.deleteOne();
    res.json({ success: true, message: 'Room deleted' });
});

// @desc  Get all rooms (admin)
// @route GET /api/rooms
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find().populate('hotel', 'name location');
    res.json({ success: true, rooms });
});

module.exports = { getRoomsByHotel, getRoom, checkAvailability, createRoom, updateRoom, deleteRoom, getAllRooms };
