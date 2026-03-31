import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiMapPin, FiUsers, FiStar, FiChevronUp, FiArrowRight } from 'react-icons/fi';
import { hotelService } from '../Services/api';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const { data } = await hotelService.getHotels(params);
      setHotels(data.hotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    if (city) newParams.set('city', city);
    if (search) newParams.set('search', search);
    if (sort) newParams.set('sort', sort);
    setSearchParams(newParams);
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Hotels & Resorts</h1>
        <p className="text-accent/60">Choose from our curated collection for your next luxury getaway.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-1/4 space-y-8 ${showFilters ? 'fixed inset-0 z-50 bg-bg-dark p-6' : 'hidden lg:block'}`}>
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-accent">Close</button>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-accent/60 uppercase tracking-wider block">Search</label>
            <div className="relative">
              <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hotel name..."
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-accent/60 uppercase tracking-wider block">Location</label>
            <div className="relative">
              <FiMapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field w-full pl-10 appearance-none"
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Manali">Manali</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-accent/60 uppercase tracking-wider block">Sort By</label>
            <div className="relative">
              <FiChevronUp size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field w-full pl-10 appearance-none"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <button onClick={handleApplyFilters} className="btn-primary w-full py-3">Apply Filters</button>
        </aside>

        {/* Listings */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <FiFilter size={18} /> Filters
            </button>
            <span className="text-sm text-accent/40">{hotels.length} results</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="card h-[350px] animate-pulse bg-white/5" />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-20 text-center border border-white/5">
              <h3 className="text-2xl font-bold text-white mb-2">No hotels found</h3>
              <p className="text-accent/60">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card flex flex-col cursor-pointer group"
                  onClick={() => navigate(`/room/${hotel._id}`)} // Redirecting to hotel's room list
                >
                  <div className="relative h-60 overflow-hidden">
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-lg">
                      {hotel.rating} <FiStar size={14} className="inline ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-accent/60 text-sm mb-4">
                      <FiMapPin size={14} className="text-primary" /> {hotel.location.address}, {hotel.location.city}
                    </div>
                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-white/5">
                      <div>
                        <span className="text-xs text-accent/40 block">Price From</span>
                        <span className="text-2xl font-bold text-white">₹{hotel.cheapestPrice.toLocaleString()}</span>
                      </div>
                      <button className="bg-white/5 hover:bg-primary/20 hover:text-primary p-3 rounded-full transition-all border border-white/10 group-hover:border-primary/50">
                        <FiArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;