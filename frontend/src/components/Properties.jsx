import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="card group cursor-pointer"
      onClick={() => navigate(`/room/${hotel._id}`)}
    >
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20">
          {hotel.location?.city || 'Luxury Stay'}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-primary">
            <FiStar size={16} fill="currentColor" />
            <span className="text-sm font-bold text-white">{hotel.rating || '4.8'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-accent/40 text-xs mb-3">
          <FiMapPin size={12} /> {hotel.location?.address}
        </div>
        <p className="text-accent/60 text-sm line-clamp-2 mb-4 leading-relaxed">{hotel.description}</p>
        <div className="flex justify-between items-center border-t border-white/5 pt-4">
          <span className="text-xs text-accent/40 uppercase tracking-wider">Starting from</span>
          <span className="text-xl font-bold text-white">₹{hotel.cheapestPrice?.toLocaleString() || '0'}<span className="text-xs text-accent/40 font-normal"> / night</span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;