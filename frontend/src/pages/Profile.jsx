import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiCreditCard, FiChevronRight, FiXCircle, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('bookings');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await bookingService.getMyBookings();
            setBookings(data.bookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const success = await updateProfile(formData);
        if (success) setEditMode(false);
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (err) {
            toast.error('Failed to cancel');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={16} className="text-green-500" />;
            case 'cancelled': return <XCircle size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-yellow-500" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="lg:w-1/3 space-y-8">
                    <div className="card p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center text-primary border-2 border-primary/20">
                            <FiUser size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                        <p className="text-accent/40 text-sm mb-6 uppercase tracking-widest">{user?.role}</p>

                        <div className="space-y-4 text-left border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-sm">
                                <FiMail size={16} className="text-primary" />
                                <span className="text-accent/60">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <FiPhone size={16} className="text-primary" />
                                <span className="text-accent/60">{user?.phone || 'No phone added'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { setTab('profile'); setEditMode(true); }}
                            className="btn-outline w-full mt-8 text-sm"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="card overflow-hidden">
                        <button
                            onClick={() => setTab('bookings')}
                            className={`w-full flex items-center justify-between p-4 text-sm font-medium transition-colors ${tab === 'bookings' ? 'bg-primary text-white' : 'hover:bg-white/5 text-accent'}`}
                        >
                            <div className="flex items-center gap-3"><FiCalendar size={18} /> My Bookings</div>
                            <FiChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => { setTab('profile'); setEditMode(false); }}
                            className={`w-full flex items-center justify-between p-4 text-sm font-medium transition-colors ${tab === 'profile' ? 'bg-primary text-white' : 'hover:bg-white/5 text-accent'}`}
                        >
                            <div className="flex items-center gap-3"><FiUser size={18} /> Account Settings</div>
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="lg:w-2/3">
                    {tab === 'bookings' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-8">Booking History</h3>
                            {loading ? (
                                [1, 2].map(i => <div key={i} className="card h-48 animate-pulse bg-white/5" />)
                            ) : bookings.length === 0 ? (
                                <div className="card p-12 text-center">
                                    <p className="text-accent/60">You haven't made any bookings yet.</p>
                                    <button onClick={() => navigate('/rooms')} className="text-primary mt-4 font-bold">Explore Rooms</button>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <motion.div
                                        layout
                                        key={booking._id}
                                        className="card flex flex-col md:flex-row group"
                                    >
                                        <div className="md:w-1/4 h-32 md:h-auto overflow-hidden">
                                            <img src={booking.hotel.images[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-6 md:w-3/4 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{booking.hotel.name}</h4>
                                                    <span className="text-accent/40 text-xs">{booking.room.title} • {booking.room.roomType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border border-white/10">
                                                    {getStatusIcon(booking.status)} {booking.status}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4 border-y border-white/5 py-3">
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Check In</span>
                                                    <span className="text-white font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Check Out</span>
                                                    <span className="text-white font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-accent/40 block mb-1">Total Price</span>
                                                    <span className="text-primary font-bold text-sm">₹{booking.totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 mt-2">
                                                {booking.status === 'pending' && <button onClick={() => handleCancel(booking._id)} className="text-red-400 text-xs hover:underline">Cancel Booking</button>}
                                                <button className="text-primary text-xs font-bold hover:underline">View Invoice</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="card p-10">
                            <h3 className="text-2xl font-bold text-white mb-8">Account Settings</h3>
                            <form onSubmit={handleUpdate} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary ${!editMode && 'opacity-60 cursor-not-allowed'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary ${!editMode && 'opacity-60 cursor-not-allowed'}`}
                                    />
                                </div>
                                {editMode && (
                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="btn-primary flex-1">Save Changes</button>
                                        <button type="button" onClick={() => setEditMode(false)} className="px-6 py-2 rounded-lg border border-white/10 text-accent hover:bg-white/5">Cancel</button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
