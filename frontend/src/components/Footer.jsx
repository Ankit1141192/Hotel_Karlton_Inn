import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-bg-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tighter block mb-6">KARLTON<span className="text-white">INN.</span></Link>
            <p className="text-accent/60 text-sm leading-relaxed mb-6">
              Step into a world of refined elegance and unparalleled comfort. Karlton Inn offers a collection of premium stays designed for the modern traveler.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"><FiFacebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"><FiInstagram size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"><FiTwitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-accent/60 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-primary transition-colors">Our Rooms</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-accent/60 text-sm">
              <li className="flex items-center gap-3"><FiMapPin size={16} className="text-primary" /> 22 Marine Drive, Mumbai, India</li>
              <li className="flex items-center gap-3"><FiPhone size={16} className="text-primary" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><FiMail size={16} className="text-primary" /> contact@karltoninn.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-accent/60 text-sm mb-4">Subscribe to our newsletter for the latest offers and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-full" />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors">
                <FiMail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-accent/40 text-xs">
          <p>© {new Date().getFullYear()} Karlton Inn Hotel & Resorts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;