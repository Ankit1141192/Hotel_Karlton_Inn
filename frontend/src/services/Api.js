import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

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
    getStats: () => api.get('/users/admin/stats'),
    getUsers: () => api.get('/users'),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export const paymentService = {
    createIntent: (bookingId) => api.post('/payment/create-intent', { bookingId }),
    confirmPayment: (bookingId) => api.post('/payment/confirm', { bookingId }),
};

export default api;
