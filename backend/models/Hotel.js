const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, default: 'India' },
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    cheapestPrice: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
