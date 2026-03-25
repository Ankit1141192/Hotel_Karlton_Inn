import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { bookingService, paymentService } from '../services/api';
import { FiCreditCard, FiShield, FiLock, FiCalendar, FiMapPin, FiUsers, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel, room, checkIn, checkOut, guests, nights } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        number: '**** **** **** 4242',
        expiry: '12/26',
        cvv: '***'
    });

    if (!location.state) {
        return <div className="p-20 text-center text-white">No booking data found. Please restart search.</div>;
    }

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await bookingService.createBooking({
                hotel: hotel._id,
                room: room._id,
                checkIn,
                checkOut,
                totalPrice: room.price * nights
            });

            // Simulate payment confirmation
            await paymentService.confirmPayment(data.booking._id);

            toast.success('Reservation Confirmed!');
            navigate('/booking-success', { state: { booking: data.booking } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary mb-8 hover:underline">
                <FiArrowLeft size={18} /> Modify Selection
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <section className="card p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FiShield className="text-primary" /> Secure Checkout
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Credit Card Number</label>
                                <div className="relative">
                                    <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                                    <input type="text" readOnly value={cardData.number} className="input-field w-full pl-12 bg-white/5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Expiration</label>
                                    <input type="text" readOnly value={cardData.expiry} className="input-field w-full bg-white/5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">CVV</label>
                                    <input type="password" readOnly value={cardData.cvv} className="input-field w-full bg-white/5" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5">
                            <form onSubmit={handleBooking}>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="btn-primary w-full h-14 text-lg font-bold flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : `Confirm & Pay ₹${(room.price * nights).toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </section>

                    <div className="flex items-center gap-2 text-accent/40 text-xs px-4">
                        <FiLock size={12} /> Your payment is encrypted and secured by industrial-grade SSL standards.
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6 bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-white mb-4 border-b border-white/5 pb-2">Booking Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-primary text-sm font-bold uppercase tracking-wide">{hotel.name}</h4>
                                <p className="text-xs text-accent/60 flex items-center gap-2 mb-2"><FiMapPin size={14} /> {hotel.location.address}, {hotel.location.city}</p>
                                <p className="text-sm font-medium text-white">{room.title}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-accent/60 flex items-center gap-2">
                                        <FiCalendar size={14} className="text-primary" /> {nights} Nights
                                    </span>
                                    <span className="text-white">₹{(room.price * nights).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-accent/60 flex items-center gap-2">
                                        <FiUsers size={14} className="text-primary" /> {guests} Guests
                                    </span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-primary font-serif">₹{(room.price * nights).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
