import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiWifi, FiCoffee, FiWind, FiTv, FiShield, FiMail, FiPhone, FiArrowLeft, FiChevronRight, FiCalendar, FiUsers } from 'react-icons/fi';
import { hotelService, roomService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    fetchHotelData();
  }, [id]);

  const fetchHotelData = async () => {
    try {
      const [hRes, rRes] = await Promise.all([
        hotelService.getHotel(id),
        roomService.getRoomsByHotel(id)
      ]);
      setHotel(hRes.data.hotel);
      setRooms(rRes.data.rooms);
    } catch (err) {
      toast.error('Failed to load hotel details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (room) => {
    if (!user) {
      toast.error('Please login to book a room');
      return navigate('/login');
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return toast.error('Please select both check-in and check-out dates');
    }

    navigate(`/checkout/${room._id}`, {
      state: {
        hotelId: id,
        room,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Loading Hotel Details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-primary-dark mb-8 transition-colors">
        <FiArrowLeft size={18} /> Back to Search
      </button>

      {/* Hotel Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={18} fill={i < Math.floor(hotel.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-accent/60 text-sm font-medium">({hotel.reviewCount} Reviews)</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{hotel.name}</h1>
          <div className="flex items-center gap-3 text-accent/80 text-lg">
            <FiMapPin size={22} className="text-primary shrink-0" />
            <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.country}</span>
          </div>
          <p className="text-accent/60 text-lg leading-relaxed">{hotel.description}</p>

          <div className="flex flex-wrap gap-4 pt-4">
            {hotel.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-accent/80">
                <FiShield size={16} className="text-primary" /> {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[400px]">
          <div className="col-span-2 h-2/3 rounded-3xl overflow-hidden shadow-2xl">
            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src={hotel.images[1] || hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <img src={hotel.images[2] || hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-black/20 transition-all">
              + {hotel.images.length} Photos
            </div>
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <h2 className="text-3xl font-bold text-white">Select Your Stay</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
              <FiCalendar size={18} className="text-primary" />
              <input
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                className="bg-transparent text-white focus:outline-none text-sm"
              />
              <FiChevronRight size={14} className="text-accent/20" />
              <input
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                className="bg-transparent text-white focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {rooms.map((room) => (
            <motion.div
              key={room._id}
              whileHover={{ x: 10 }}
              className="card flex flex-col md:flex-row group"
            >
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 md:w-2/3 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">{room.roomType}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{room.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary italic font-serif">₹{room.price.toLocaleString()}</span>
                    <span className="text-accent/40 text-xs block">per night</span>
                  </div>
                </div>
                <p className="text-accent/60 mb-6 flex-grow">{room.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-accent/80"><FiWifi size={16} className="text-primary" /> Free WiFi</div>
                  <div className="flex items-center gap-2 text-sm text-accent/80"><FiCoffee size={16} className="text-primary" /> Breakfast</div>
                  <div className="flex items-center gap-2 text-sm text-accent/80"><FiWind size={16} className="text-primary" /> A/C</div>
                  <div className="flex items-center gap-2 text-sm text-accent/80"><FiUsers size={16} className="text-primary" /> {room.maxGuests} Guests</div>
                </div>

                <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-6">
                  <button className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    View Details <FiChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => handleBooking(room)}
                    className="btn-primary"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoomDetails;