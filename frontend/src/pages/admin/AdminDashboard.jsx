import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { FiUsers, FiBriefcase, FiCalendar, FiTrendingUp, FiClock, FiUser, FiHome, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await adminService.getAdminStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Revenue', value: stats ? `₹${stats.revenue.toLocaleString()}` : '0', icon: <FiTrendingUp size={24} />, color: 'text-primary' },
        { title: 'Total Bookings', value: stats?.totalBookings || '0', icon: <FiCalendar size={24} />, color: 'text-blue-400' },
        { title: 'Total Users', value: stats?.totalUsers || '0', icon: <FiUsers size={24} />, color: 'text-purple-400' },
        { title: 'Hotels Active', value: stats?.totalHotels || '0', icon: <FiBriefcase size={24} />, color: 'text-green-400' },
    ];

    if (loading) return <div className="p-8 text-center text-primary">Loading statistics...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Executive Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card p-6 border-b-4 border-primary/20"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${card.color}`}>
                            {card.icon}
                        </div>
                        <p className="text-accent/40 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                        <Link to="/admin/bookings" className="text-primary text-sm hover:underline flex items-center gap-1">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-bold text-accent/20 uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="pb-4">Reference</th>
                                    <th className="pb-4">Guest</th>
                                    <th className="pb-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {stats?.recentBookings.map((booking, i) => (
                                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-mono text-xs text-accent/40">{booking._id.slice(-8).toUpperCase()}</td>
                                        <td className="py-4 text-white font-medium">{booking.user?.name}</td>
                                        <td className="py-4 text-right text-primary font-bold">₹{booking.totalPrice.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card p-8">
                    <h3 className="text-xl font-bold text-white mb-8">System Activity</h3>
                    <div className="space-y-6">
                        {[
                            { type: 'Booking', message: 'New booking from Priya S.', time: '2 mins ago', icon: <FiCalendar size={14} /> },
                            { type: 'Support', message: 'Technical inquiry logged.', time: '1 hour ago', icon: <FiClock size={14} /> },
                            { type: 'Update', message: 'Raj Palace prices updated.', time: '5 hours ago', icon: <FiHome size={14} /> },
                            { type: 'User', message: 'New user registration.', time: '12 hours ago', icon: <FiUser size={14} /> },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/5">
                                    {activity.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium">{activity.message}</p>
                                    <p className="text-[10px] text-accent/40">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
