import React, { useState, useEffect } from 'react';
import { hotelService } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiStar, FiHome, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: { city: '', address: '', country: 'India' },
        images: [''],
        amenities: [''],
        cheapestPrice: 0,
        featured: false,
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const { data } = await hotelService.getHotels();
            setHotels(data.hotels);
        } catch (err) {
            toast.error('Failed to load hotels');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHotel) {
                await hotelService.updateHotel(editingHotel._id, formData);
                toast.success('Hotel updated');
            } else {
                await hotelService.createHotel(formData);
                toast.success('Hotel created');
            }
            setIsModalOpen(false);
            fetchHotels();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete all associated rooms.')) return;
        try {
            await hotelService.deleteHotel(id);
            toast.success('Hotel deleted');
            fetchHotels();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const openForm = (hotel = null) => {
        setEditingHotel(hotel);
        if (hotel) setFormData(hotel);
        else setFormData({ name: '', description: '', location: { city: '', address: '', country: 'India' }, images: [''], amenities: [''], cheapestPrice: 0, featured: false });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Hotels</h1>
                <button onClick={() => openForm()} className="btn-primary flex items-center gap-2">
                    <FiPlus size={18} /> Add New Hotel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="card h-64 animate-pulse bg-white/5" />)
                ) : hotels.map(hotel => (
                    <div key={hotel._id} className="card p-6 flex flex-col group">
                        <div className="h-40 bg-white/5 rounded-xl overflow-hidden mb-4 border border-white/10">
                            <img src={hotel.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-lg">{hotel.name}</h3>
                            <span className="text-primary flex items-center gap-1 text-sm font-bold"><FiStar size={14} fill="currentColor" /> {hotel.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-accent/40 text-xs mb-6">
                            <FiMapPin size={12} /> {hotel.location.city}
                        </div>
                        <div className="mt-auto flex gap-4">
                            <button onClick={() => openForm(hotel)} className="flex-1 bg-white/5 hover:bg-primary/20 hover:text-primary p-2 rounded-lg text-sm font-medium border border-white/10 transition-all flex items-center justify-center gap-2">
                                <FiEdit size={14} /> Edit
                            </button>
                            <button onClick={() => handleDelete(hotel._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 transition-all border border-red-500/20">
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal Wrapper */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card-dark border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 underline decoration-primary underline-offset-8">
                            {editingHotel ? 'Edit Property' : 'Submit New Property'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">Property Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field w-full" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">City</label>
                                    <input type="text" required value={formData.location.city} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} className="input-field w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/40 uppercase">Address</label>
                                <input type="text" required value={formData.location.address} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} className="input-field w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/40 uppercase">Description</label>
                                <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field w-full resize-none" />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="btn-primary flex-1">Save Property</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-white/10 text-accent hover:bg-white/5 rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHotels;
