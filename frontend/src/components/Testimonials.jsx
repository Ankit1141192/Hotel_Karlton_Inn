import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const Testimonials = () => {
  const reviews = [
    { name: 'Sarah Jenkins', role: 'Business Traveler', text: 'An absolute masterpiece of hospitality. The attention to detail at Karlton Inn is unlike anything I have experienced in my decades of travel.', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'David Chen', role: 'Luxury Enthusiast', text: 'From the moment I stepped into the lobby, I knew I was in for something special. The spa treatments were divine and the staff was impeccable.', avatar: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Elena Rodriguez', role: 'Vlogger', text: 'If you are looking for the perfect blend of modern luxury and traditional heritage, this is it. Every corner of the resort is a work of art.', avatar: 'https://i.pravatar.cc/150?u=elena' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Voices of Excellence</h2>
        <p className="text-accent/40 italic">What our most distinguished guests have to say.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="card p-8 relative"
          >
            <FiMessageSquare size={40} className="text-primary/10 absolute top-6 right-6" />
            <div className="flex text-primary mb-6">
              {[...Array(5)].map((_, j) => <FiStar key={j} size={14} fill="currentColor" />)}
            </div>
            <p className="text-accent/60 italic mb-8 leading-relaxed">"{rev.text}"</p>
            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
              <img src={rev.avatar} alt="" className="w-12 h-12 rounded-full border border-primary/20" />
              <div>
                <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-accent/40">{rev.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;