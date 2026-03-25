import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiMapPin, FiMail, FiArrowRight, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BookingSuccess = () => {
    const location = useLocation();
    const { booking } = location.state || {};

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card max-w-2xl w-full p-12 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 border border-green-500/20">
                    <FiCheckCircle size={56} />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">Reservation Confirmed</h1>
                <p className="text-accent/60 text-lg mb-10">
                    Thank you for choosing Karlton Inn. Your premium stay has been successfully reserved. A confirmation email has been sent to your inbox.
                </p>

                {booking && (
                    <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/5 grid grid-cols-2 gap-6 text-left">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">Booking ID</span>
                            <p className="text-white font-mono text-sm">#{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">Amount Paid</span>
                            <p className="text-primary font-bold">₹{booking.totalPrice.toLocaleString()}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/profile" className="btn-primary flex items-center justify-center gap-2">
                        View My Bookings <FiArrowRight size={18} />
                    </Link>
                    <button className="btn-outline flex items-center justify-center gap-2">
                        Download Invoice <FiDownload size={18} />
                    </button>
                </div>

                <Link to="/" className="text-accent/40 hover:text-primary transition-colors text-sm mt-8 block">
                    Return to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
