import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiZap } from 'react-icons/fi';

const CTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse"><FiZap size={120} /></div>
        <div className="absolute bottom-0 left-0 p-10 opacity-10 animate-pulse"><FiMail size={120} /></div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Experience <br /> the Extraordinary?</h2>
        <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-serif italic">
          Join thousands of travelers who have chosen Karlton Inn for their most precious memories. Your luxury suite is waiting.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-accent transition-all hover:scale-105">
            Become a Member
          </Link>
          <Link to="/rooms" className="bg-primary-dark text-white px-10 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-primary transition-all hover:scale-105">
            Book Your Stay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;