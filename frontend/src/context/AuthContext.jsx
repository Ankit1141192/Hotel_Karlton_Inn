import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    // Whenever token changes, set axios default header and re-fetch user
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchMe();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Fetch current logged-in user — works for both regular users and admins
    // (both share the same /api/auth/me endpoint because the JWT is identical)
    const fetchMe = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/auth/me`);
            setUser(data.user);
        } catch (err) {
            // Token is invalid / expired — clear everything
            clearAuth();
        } finally {
            setLoading(false);
        }
    };

    const clearAuth = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    /**
     * Unified Login — works for both regular users and admins.
     * The backend /auth/login endpoint checks the email/password across all users.
     */
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            applyAuth(data.token, data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            return data.user; // Return user object for role-based redirection
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            return null;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/register`, userData);
            applyAuth(data.token, data.user);
            toast.success('Account created successfully!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const adminRegister = async (userData) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/admin/auth/register`, userData);
            applyAuth(data.token, data.user);
            toast.success('Admin account created successfully!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Admin registration failed');
            return false;
        }
    };

    const applyAuth = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = () => {
        clearAuth();
        toast.success('Logged out successfully');
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await axios.put(`${BASE_URL}/users/profile`, userData);
            setUser(data.user);
            toast.success('Profile updated successfully');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, adminRegister, logout, updateProfile, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
