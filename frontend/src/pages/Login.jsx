import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        if (success) navigate('/');
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-10 rounded-3xl"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tighter mb-4 inline-block">KARLTON<span className="text-white">INN.</span></Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-accent/60">Unlock your next premium experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Email Address</label>
                        <div className="relative">
                            <FiMail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input-field w-full pl-12 h-14"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-accent/60 uppercase tracking-widest block">Password</label>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                        </div>
                        <div className="relative">
                            <FiLock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-field w-full pl-12 pr-12 h-14"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/40 hover:text-primary transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                        {!loading && <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm">
                    <p className="text-accent/40">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
