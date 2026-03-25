const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    maxGuests: { type: Number, default: 2 },
    roomType: {
        type: String,
        enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential'],
        default: 'Standard'
    },
    amenities: [{ type: String }],
    unavailableDates: [{ type: Date }],
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
