const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// @desc  Create payment intent
// @route POST /api/payment/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('Access denied');
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalPrice * 100), // in paise/cents
        currency: 'inr',
        metadata: { bookingId: bookingId.toString() },
    });
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc  Confirm payment (webhook / mock)
// @route POST /api/payment/confirm
const confirmPayment = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) { res.status(404); throw new Error('Booking not found'); }
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    res.json({ success: true, booking });
});

module.exports = { createPaymentIntent, confirmPayment };
