import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600"
          alt="Hero Background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/60 via-bg-dark/20 to-bg-dark" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold text-white mb-6"
        >
          Refined Luxury for the <br /> <span className="text-primary italic">Modern Traveler.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-accent/80 mb-10 max-w-2xl mx-auto"
        >
          Discover a collection of premium hotels and resorts designed to provide an unparalleled experience of comfort and elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-white/10">
            <FiMapPin size={20} className="text-primary shrink-0" />
            <input type="text" placeholder="Where are you going?" className="bg-transparent border-none focus:ring-0 text-white placeholder:text-accent/40 w-full" />
          </div>
          <div className="flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-white/10">
            <FiCalendar size={20} className="text-primary shrink-0" />
            <input type="text" placeholder="Add dates" className="bg-transparent border-none focus:ring-0 text-white placeholder:text-accent/40 w-full" />
          </div>
          <div className="flex items-center gap-3 px-6 py-3 w-full">
            <FiUsers size={20} className="text-primary shrink-0" />
            <input type="text" placeholder="Add guests" className="bg-transparent border-none focus:ring-0 text-white placeholder:text-accent/40 w-full" />
          </div>
          <button className="btn-primary flex items-center gap-2 w-full md:w-auto px-8 py-4 md:py-3 rounded-xl md:rounded-full">
            <FiSearch size={20} /> <span className="md:hidden lg:inline">Search</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;