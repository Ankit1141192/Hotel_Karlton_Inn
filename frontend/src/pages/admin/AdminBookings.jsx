import React, { useState, useEffect } from "react";
import { bookingService } from "../../services/api";
import { FiSearch, FiEye, FiFilter, FiTrash2, FiCalendar, FiUser, FiHome, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from "react-hot-toast";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getAllBookings();
      setBookings(data.bookings);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.hotel.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reservation Central
          </h1>
          <p className="text-accent/40">
            Oversee all guest bookings and stay statuses.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-accent/40 uppercase tracking-[0.15em] border-b border-white/5 bg-white/5">
                <th className="px-6 py-4">Guest Details</th>
                <th className="px-6 py-4">Stay Info</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-accent/40">
                    Retrieving records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-accent/40">
                    No entries found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {booking.user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {booking.user.name}
                          </p>
                          <p className="text-[10px] text-accent/40">
                            {booking.user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {booking.hotel.name}
                      </p>
                      <p className="text-[10px] text-accent/40">
                        {new Date(booking.checkIn).toLocaleDateString()} —{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-primary italic">
                      ₹{booking.totalPrice.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button onClick={() => handleUpdateStatus(booking._id, 'confirmed')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"><FiCheckCircle size={16} /></button>
                            <button onClick={() => handleUpdateStatus(booking._id, 'cancelled')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><FiXCircle size={16} /></button>
                          </>
                        )}
                        <button className="p-2 bg-white/5 text-accent rounded-lg hover:text-primary transition-all"><FiEye size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;