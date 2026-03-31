import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/Api';
import {
    FiUser, FiMail, FiPhone, FiCalendar, FiChevronRight,
    FiXCircle, FiClock, FiCheckCircle, FiLayout, FiLogOut, FiShield
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('bookings');
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    // Keep form in sync if user object updates
    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', phone: user.phone || '' });
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const { data } = await bookingService.getMyBookings();
            setBookings(data.bookings || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateProfile(formData);
        setSaving(false);
        if (success) setEditMode(false);
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (err) {
            toast.error('Failed to cancel booking');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FiCheckCircle size={14} className="text-green-400" />;
            case 'cancelled': return <FiXCircle size={14} className="text-red-400" />;
            default: return <FiClock size={14} className="text-yellow-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-10">

                {/* ── Sidebar ── */}
                <aside className="lg:w-1/3 space-y-6">

                    {/* User Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-8 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />

                        {/* Avatar */}
                        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-primary/30">
                            <FiUser size={42} className="text-primary" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>

                        {/* Role badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mt-2 px-3 py-1 rounded-full border ${isAdmin ? 'text-primary bg-primary/10 border-primary/20' : 'text-accent/40 bg-white/5 border-white/10'}`}>
                            {isAdmin && <FiShield size={12} />}
                            {user?.role}
                        </span>

                        {/* Contact info */}
                        <div className="space-y-3 text-left border-t border-white/5 pt-6 mt-6">
                            <div className="flex items-center gap-3 text-sm">
                                <FiMail size={15} className="text-primary shrink-0" />
                                <span className="text-accent/60 truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <FiPhone size={15} className="text-primary shrink-0" />
                                <span className="text-accent/60">{user?.phone || 'No phone added'}</span>
                            </div>
                        </div>

                        {/* Edit profile */}
                        <button
                            onClick={() => { setTab('profile'); setEditMode(true); }}
                            className="btn-outline w-full mt-6 text-sm"
                        >
                            Edit Profile
                        </button>
                    </motion.div>

                    {/* Navigation Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card overflow-hidden"
                    >
                        <button
                            onClick={() => setTab('bookings')}
                            className={`w-full flex items-center justify-between p-4 text-sm font-medium transition-colors ${tab === 'bookings' ? 'bg-primary text-white' : 'hover:bg-white/5 text-accent'}`}
                        >
                            <div className="flex items-center gap-3"><FiCalendar size={17} /> My Bookings</div>
                            <FiChevronRight size={15} />
                        </button>

                        <button
                            onClick={() => { setTab('profile'); setEditMode(false); }}
                            className={`w-full flex items-center justify-between p-4 text-sm font-medium transition-colors border-t border-white/5 ${tab === 'profile' ? 'bg-primary text-white' : 'hover:bg-white/5 text-accent'}`}
                        >
                            <div className="flex items-center gap-3"><FiUser size={17} /> Account Settings</div>
                            <FiChevronRight size={15} />
                        </button>

                        {/* Admin Dashboard link — only visible if user is admin */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="w-full flex items-center justify-between p-4 text-sm font-medium border-t border-white/5 hover:bg-primary/10 text-primary transition-colors"
                            >
                                <div className="flex items-center gap-3"><FiLayout size={17} /> Admin Dashboard</div>
                                <FiChevronRight size={15} />
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 text-sm font-medium border-t border-white/5 hover:bg-red-500/10 text-red-400 transition-colors"
                        >
                            <div className="flex items-center gap-3"><FiLogOut size={17} /> Logout</div>
                            <FiChevronRight size={15} />
                        </button>
                    </motion.div>
                </aside>

                {/* ── Content Area ── */}
                <main className="lg:w-2/3">

                    {/* Bookings Tab */}
                    {tab === 'bookings' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Booking History</h3>

                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="card h-36 animate-pulse bg-white/5" />
                                ))
                            ) : bookings.length === 0 ? (
                                <div className="card p-16 text-center">
                                    <FiCalendar size={40} className="text-primary/30 mx-auto mb-4" />
                                    <p className="text-accent/60 mb-4">You haven't made any bookings yet.</p>
                                    <button
                                        onClick={() => navigate('/rooms')}
                                        className="btn-primary text-sm"
                                    >
                                        Explore Rooms
                                    </button>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <motion.div
                                        layout
                                        key={booking._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="card flex flex-col md:flex-row group"
                                    >
                                        {/* Room thumbnail */}
                                        <div className="md:w-1/4 h-36 md:h-auto overflow-hidden shrink-0">
                                            <img
                                                src={booking.hotel?.images?.[0] || 'https://via.placeholder.com/200'}
                                                alt={booking.hotel?.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="p-6 md:w-3/4 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">{booking.hotel?.name}</h4>
                                                    <span className="text-accent/40 text-xs">{booking.room?.title} • {booking.room?.roomType}</span>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${getStatusColor(booking.status)}`}>
                                                    {getStatusIcon(booking.status)} {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-3 border-y border-white/5 py-3">
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Check In</span>
                                                    <span className="text-white font-medium">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Check Out</span>
                                                    <span className="text-white font-medium">{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Total Price</span>
                                                    <span className="text-primary font-bold text-sm">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 mt-1">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        className="text-red-400 text-xs hover:underline"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                                <button className="text-primary text-xs font-bold hover:underline">
                                                    View Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Account Settings Tab */}
                    {tab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card p-10"
                        >
                            <h3 className="text-2xl font-bold text-white mb-8">Account Settings</h3>

                            <form onSubmit={handleUpdate} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`input-field w-full ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        readOnly
                                        value={user?.email || ''}
                                        className="input-field w-full opacity-60 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-accent/30">Email cannot be changed.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 XXXXX XXXXX"
                                        className={`input-field w-full ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Role</label>
                                    <div className="input-field w-full opacity-60 flex items-center gap-2">
                                        {isAdmin && <FiShield size={14} className="text-primary" />}
                                        <span className="capitalize">{user?.role}</span>
                                    </div>
                                </div>

                                {!editMode ? (
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(true)}
                                        className="btn-primary"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn-primary flex-1"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({ name: user?.name || '', phone: user?.phone || '' });
                                            }}
                                            className="px-6 py-2 rounded-lg border border-white/10 text-accent hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>

                            {/* Admin quick link inside settings */}
                            {isAdmin && (
                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-accent/40 uppercase tracking-widest mb-4">Admin Access</h4>
                                    <Link to="/admin" className="inline-flex items-center gap-2 btn-outline text-primary border-primary text-sm">
                                        <FiLayout size={16} /> Open Admin Dashboard
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
