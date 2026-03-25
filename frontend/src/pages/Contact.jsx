import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-white/5 py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl md:text-6xl font-bold text-white mb-6">Connect With <span className="text-primary italic">Us.</span></motion.h1>
          <p className="text-accent/60 text-lg italic font-serif">Expect a response within 24 hours from our dedicated concierge team.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 card p-10 lg:p-12 shadow-2xl relative bg-bg-dark">
            <h2 className="text-3xl font-bold text-white mb-8 italic">Send an Inquiry</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Full Name</label>
                  <input type="text" className="input-field w-full h-14" placeholder="Alexander Graham" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Email Address</label>
                  <input type="email" className="input-field w-full h-14" placeholder="alex@resort.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Subject</label>
                <select className="input-field w-full h-14 appearance-none">
                  <option>General Reservation Enquiry</option>
                  <option>Corporate Events & Bookings</option>
                  <option>Feedback & Experience</option>
                  <option>Wedding & Celebration</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-accent/40 uppercase tracking-widest">Your Message</label>
                <textarea rows="6" className="input-field w-full resize-none py-4" placeholder="How may we assist you today?"></textarea>
              </div>
              <button className="btn-primary w-full h-16 text-lg flex items-center justify-center gap-3">
                Send Message <FiSend size={20} />
              </button>
            </form>
          </div>

          {/* Info Panels */}
          <div className="space-y-6">
            <div className="card p-8 space-y-8">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Our Locations</h3>
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                    <FiMapPin size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Headquarters (Mumbai)</h5>
                    <p className="text-accent/60 text-xs mt-1 leading-relaxed">22 Marine Drive, Nariman Point, Maharashtra 400021</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Reservation Desk</h5>
                    <p className="text-accent/60 text-xs mt-1">+91 (22) 2345 6789</p>
                    <p className="text-accent/60 text-xs">Available 24/7</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Email Inquiries</h5>
                    <p className="text-accent/60 text-xs mt-1">concierge@karltoninn.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Follow Our Story</h3>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all border border-white/10"><FiInstagram size={24} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all border border-white/10"><FiFacebook size={24} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all border border-white/10"><FiTwitter size={24} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;