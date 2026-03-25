import React, { useState, useEffect } from 'react';
import { roomService, hotelService } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiHome, FiGrid, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        hotel: '',
        title: '',
        description: '',
        price: 0,
        maxGuests: 2,
        roomType: 'Standard',
        amenities: [''],
        images: [''],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rRes, hRes] = await Promise.all([
                roomService.getAllRooms(),
                hotelService.getHotels()
            ]);
            setRooms(rRes.data.rooms);
            setHotels(hRes.data.hotels);
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                await roomService.updateRoom(editingRoom._id, formData);
                toast.success('Room updated');
            } else {
                await roomService.createRoom(formData.hotel, formData);
                toast.success('Room created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await roomService.deleteRoom(id);
            toast.success('Room deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const openForm = (room = null) => {
        setEditingRoom(room);
        if (room) {
            setFormData({
                hotel: room.hotel._id,
                title: room.title,
                description: room.description,
                price: room.price,
                maxGuests: room.maxGuests,
                roomType: room.roomType,
                amenities: room.amenities,
                images: room.images
            });
        } else {
            setFormData({ hotel: '', title: '', description: '', price: 0, maxGuests: 2, roomType: 'Standard', amenities: [''], images: [''] });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Room Inventory</h1>
                    <p className="text-accent/40 italic">Manage your room allocations and pricing across properties.</p>
                </div>
                <button onClick={() => openForm()} className="btn-primary flex items-center gap-2">
                    <FiPlus size={18} /> Add New Room
                </button>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-xs font-bold text-accent/40 uppercase tracking-widest border-b border-white/5 bg-white/5">
                        <tr>
                            <th className="px-6 py-4">Room Info</th>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-center">Guests</th>
                            <th className="px-6 py-4 text-center">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-accent/40">Loading inventory...</td></tr>
                        ) : rooms.map(room => (
                            <tr key={room._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                                            <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-white">{room.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-accent/60">{room.hotel?.name}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase py-1 px-2 rounded bg-primary/10 text-primary border border-primary/20">{room.roomType}</span>
                                </td>
                                <td className="px-6 py-4 text-center">{room.maxGuests}</td>
                                <td className="px-6 py-4 text-center font-bold text-primary italic">₹{room.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openForm(room)} className="p-2 hover:text-primary transition-colors"><FiEdit size={16} /></button>
                                        <button onClick={() => handleDelete(room._id)} className="p-2 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card-dark border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 underline decoration-primary underline-offset-8">Configure Accomodation</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/40 uppercase">Belongs to Hotel</label>
                                <select required value={formData.hotel} onChange={(e) => setFormData({ ...formData, hotel: e.target.value })} className="input-field w-full appearance-none">
                                    <option value="">Select Property...</option>
                                    {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">Room Title</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field w-full" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">Room Type</label>
                                    <select value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })} className="input-field w-full appearance-none">
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Family">Family</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">Nightly Rate (₹)</label>
                                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field w-full" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent/40 uppercase">Max Guests</label>
                                    <input type="number" required value={formData.maxGuests} onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })} className="input-field w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/40 uppercase">Room Image URL</label>
                                <input type="text" required value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} className="input-field w-full" />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="btn-primary flex-1">Finalize Room</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-white/10 text-accent hover:bg-white/5 rounded-lg">Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRooms;
