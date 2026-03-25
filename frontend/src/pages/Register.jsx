import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(formData);
        if (success) navigate('/');
        setLoading(false);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-lg p-10 rounded-3xl"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tighter mb-4 inline-block">KARLTON<span className="text-white">INN.</span></Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Join the Elite</h2>
                    <p className="text-accent/60">Experience the world's most refined stays.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Full Name</label>
                            <div className="relative">
                                <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field w-full pl-12 h-14"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Phone Number</label>
                            <div className="relative">
                                <FiPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                                <input
                                    type="text" required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-field w-full pl-12 h-14"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Email Address</label>
                        <div className="relative">
                            <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                            <input
                                type="email" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field w-full pl-12 h-14"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Password</label>
                        <div className="relative">
                            <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                            <input
                                type="password" required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field w-full pl-12 h-14"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                        {!loading && <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm">
                    <p className="text-accent/40">
                        Already have an account? {' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
