import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAward, FiUsers, FiGlobe, FiClock, FiStar } from 'react-icons/fi';

const About = () => {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600" className="w-full h-full object-cover grayscale opacity-40" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-transparent to-bg-dark" />
        </div>
        <div className="relative text-center px-4">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-serif italic text-xl mb-4 tracking-widest">Our Legacy</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-6">A Century of <br /> <span className="text-primary italic">Excellence.</span></motion.h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white leading-tight">Beyond Hospitality: <br /> Crafting Memories.</h2>
            <p className="text-accent/60 text-lg leading-relaxed">
              Founded in 1924, Karlton Inn has stood as a beacon of refined elegance for over a hundred years. What started as a small family boutique in Mumbai has evolved into India's most prestigious hospitality group.
            </p>
            <p className="text-accent/60 text-lg leading-relaxed">
              Our philosophy is simple: we don't just provide a room; we provide an experience that resonates with the soul. From the thread count of our linens to the sourcing of our organic ingredients, every detail is a testament to our commitment to perfection.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-4xl font-serif font-bold text-primary mb-2">120+</p>
                <p className="text-xs uppercase tracking-widest text-accent/40">Luxury Suites</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-primary mb-2">25</p>
                <p className="text-xs uppercase tracking-widest text-accent/40">Global Awards</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1541971875076-8f97bd8813be?w=800" className="rounded-3xl shadow-2xl relative z-10" alt="" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full z-0 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Principles</h2>
            <p className="text-accent/40 italic">What drives us at Karlton Inn.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: <FiShield size={32} />, title: 'Integrity', desc: 'Trust is our foundation. We maintain transparency in every guest interaction.' },
              { icon: <FiGlobe size={32} />, title: 'Inclusivity', desc: 'A home for travelers from every corner of the globe, celebrating diversity.' },
              { icon: <FiAward size={32} />, title: 'Innovation', desc: 'Leading the industry with modern amenities while honoring our heritage.' },
            ].map((v, i) => (
              <div key={i} className="space-y-6 group">
                <div className="w-16 h-16 bg-bg-dark rounded-full mx-auto flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-white/5">
                  {v.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{v.title}</h4>
                <p className="text-accent/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;