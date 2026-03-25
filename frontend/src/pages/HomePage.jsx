import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import Herosection from '../components/Herosection';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Properties from '../components/Properties';

const HomePage = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const { data } = await hotelService.getFeatured();
      setFeaturedHotels(data.hotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-24">
      <Herosection />

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Featured Destinations</h2>
            <p className="text-accent/60 italic">Handpicked luxury stays across India's most iconic locations.</p>
          </div>
          <Link to="/rooms" className="text-primary flex items-center gap-2 hover:gap-3 transition-all font-medium">
            Explore All <FiArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card h-[400px] animate-pulse bg-white/5" />
            ))
          ) : (
            featuredHotels.map((hotel) => (
              <Properties key={hotel._id} hotel={hotel} />
            ))
          )}
        </div>
      </section>

      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;