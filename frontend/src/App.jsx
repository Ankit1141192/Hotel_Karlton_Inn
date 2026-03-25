import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels from './pages/admin/AdminHotels';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout/:id" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/booking-success" element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/hotels" element={
            <ProtectedRoute adminOnly>
              <AdminHotels />
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute adminOnly>
              <AdminRooms />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />

          <Route path="*" element={<h1 className="text-center py-20 text-4xl">404 Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;