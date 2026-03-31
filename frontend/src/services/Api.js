import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Attach token from localStorage to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const hotelService = {
    getHotels: (params) => api.get('/hotels', { params }),
    getHotel: (id) => api.get(`/hotels/${id}`),
    getFeatured: () => api.get('/hotels/featured'),
    createHotel: (data) => api.post('/hotels', data),
    updateHotel: (id, data) => api.put(`/hotels/${id}`, data),
    deleteHotel: (id) => api.delete(`/hotels/${id}`),
};

export const roomService = {
    getRoomsByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),
    getRoom: (id) => api.get(`/rooms/${id}`),
    checkAvailability: (id, params) => api.get(`/rooms/${id}/availability`, { params }),
    createRoom: (hotelId, data) => api.post(`/rooms/hotel/${hotelId}`, data),
    updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
    deleteRoom: (id) => api.delete(`/rooms/${id}`),
    getAllRooms: () => api.get('/rooms'),
};

export const bookingService = {
    createBooking: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    getBooking: (id) => api.get(`/bookings/${id}`),
    cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
    getAllBookings: () => api.get('/bookings'),
    updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
};

export const adminService = {
    // Dashboard stats — correct admin route
    getStats: () => api.get('/admin/stats'),
    getAdminStats: () => api.get('/admin/stats'),   // alias used by AdminDashboard component

    // Auth
    adminRegister: (data) => api.post('/auth/admin/register', data),
    adminLogin: (data) => api.post('/auth/login', data),

    // Users
    getUsers: () => api.get('/admin/users'),
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Hotels
    getHotels: () => api.get('/admin/hotels'),
    createHotel: (data) => api.post('/admin/hotels', data),
    updateHotel: (id, data) => api.put(`/admin/hotels/${id}`, data),
    deleteHotel: (id) => api.delete(`/admin/hotels/${id}`),

    // Rooms
    getRooms: () => api.get('/admin/rooms'),
    createRoom: (hotelId, data) => api.post(`/admin/rooms/hotel/${hotelId}`, data),
    updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
    deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),

    // Bookings
    getBookings: () => api.get('/admin/bookings'),
    getBooking: (id) => api.get(`/admin/bookings/${id}`),
    updateBookingStatus: (id, data) => api.put(`/admin/bookings/${id}/status`, data),
    deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
};

export const paymentService = {
    createIntent: (bookingId) => api.post('/payment/create-intent', { bookingId }),
    confirmPayment: (bookingId) => api.post('/payment/confirm', { bookingId }),
};

export default api;
