import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchMe();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchMe = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/auth/me');
            setUser(data.user);
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            toast.success('Welcome back!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            toast.success('Account created successfully');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Logged out');
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await axios.put('http://localhost:5000/api/users/profile', userData);
            setUser(data.user);
            toast.success('Profile updated');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
