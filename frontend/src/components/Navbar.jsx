import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiLayout } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-dark/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary tracking-tighter">KARLTON<span className="text-white">INN.</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-accent'}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-primary transition-all">
                  <FiUser size={18} className="text-primary" />
                  <span>{user.name}</span>
                  <FiChevronDown size={14} />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-card-dark border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-primary">
                      <FiLayout size={16} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5">
                    <FiUser size={16} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-red-400">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-6 py-2">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-accent hover:text-primary transition-colors">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-bg-dark transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-8 gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `text-2xl font-medium ${isActive ? 'text-primary' : 'text-white'}`}
            >
              {link.name}
            </NavLink>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <div className="flex flex-col gap-6">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="text-xl">Profile</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xl text-primary">Admin Panel</Link>}
              <button onClick={handleLogout} className="text-left text-xl text-red-400">Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;