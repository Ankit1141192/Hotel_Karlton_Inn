const asyncHandler = require('express-async-handler');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc  Get all hotels (with search & filter)
// @route GET /api/hotels
const getHotels = asyncHandler(async (req, res) => {
    const { city, minPrice, maxPrice, rating, featured, search, sort } = req.query;
    const query = {};

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (featured) query.featured = featured === 'true';
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
        query.cheapestPrice = {};
        if (minPrice) query.cheapestPrice.$gte = Number(minPrice);
        if (maxPrice) query.cheapestPrice.$lte = Number(maxPrice);
    }

    let sortObj = {};
    if (sort === 'price_asc') sortObj.cheapestPrice = 1;
    else if (sort === 'price_desc') sortObj.cheapestPrice = -1;
    else if (sort === 'rating') sortObj.rating = -1;
    else sortObj.createdAt = -1;

    const hotels = await Hotel.find(query).sort(sortObj).populate('rooms', 'price roomType');
    res.json({ success: true, count: hotels.length, hotels });
});

// @desc  Get single hotel
// @route GET /api/hotels/:id
const getHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('rooms');
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    res.json({ success: true, hotel });
});

// @desc  Create hotel (admin)
// @route POST /api/hotels
const createHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, hotel });
});

// @desc  Update hotel (admin)
// @route PUT /api/hotels/:id
const updateHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    res.json({ success: true, hotel });
});

// @desc  Delete hotel (admin)
// @route DELETE /api/hotels/:id
const deleteHotel = asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }
    await Room.deleteMany({ hotel: hotel._id });
    await hotel.deleteOne();
    res.json({ success: true, message: 'Hotel deleted' });
});

// @desc  Get featured hotels
// @route GET /api/hotels/featured
const getFeaturedHotels = asyncHandler(async (req, res) => {
    const hotels = await Hotel.find({ featured: true }).limit(6).populate('rooms', 'price');
    res.json({ success: true, hotels });
});

module.exports = { getHotels, getHotel, createHotel, updateHotel, deleteHotel, getFeaturedHotels };
