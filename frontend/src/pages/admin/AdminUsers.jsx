import React, { useState, useEffect } from "react";
import { adminService } from "../../services/api";
import { FiSearch, FiTrash2, FiUser, FiShield, FiMail, FiCalendar } from 'react-icons/fi';
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminService.getUsers();
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone."))
      return;
    try {
      await adminService.deleteUser(id);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Member Directory
          </h1>
          <p className="text-accent/40 italic">
            Manage access and account statuses for all registered members.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/40" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="card h-40 animate-pulse bg-white/5"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="lg:col-span-3 card p-20 text-center text-accent/40 italic">
            No members found matching your query.
          </div>
        ) : (
          filtered.map((user) => (
            <div
              key={user._id}
              className="card p-6 flex items-start gap-4 group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shrink-0">
                {user.name[0]}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">
                      {user.name}
                    </h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2 text-white"><FiMail size={14} className="text-primary" /> {user.email}</div>
                      <div className="flex items-center gap-2 text-accent/40 text-[10px]"><FiCalendar size={12} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${user.role === "admin"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-white/5 text-accent/40 border border-white/10"
                      }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="mt-6 flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-accent/40 italic">
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={user.role === "admin"}
                    className="p-1.5 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;