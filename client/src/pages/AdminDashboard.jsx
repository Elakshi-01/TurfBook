import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08120c] text-white text-2xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08120c] text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-[#12221a] rounded-xl p-6">
            <p className="text-gray-400">Users</p>
            <h2 className="text-5xl font-bold mt-3">
              {stats.totalUsers}
            </h2>
          </div>

          <div className="bg-[#12221a] rounded-xl p-6">
            <p className="text-gray-400">Turfs</p>
            <h2 className="text-5xl font-bold mt-3">
              {stats.totalTurfs}
            </h2>
          </div>

          <div className="bg-[#12221a] rounded-xl p-6">
            <p className="text-gray-400">Bookings</p>
            <h2 className="text-5xl font-bold mt-3">
              {stats.totalBookings}
            </h2>
          </div>

          <div className="bg-[#12221a] rounded-xl p-6">
            <p className="text-gray-400">Pending Turfs</p>
            <h2 className="text-5xl font-bold text-yellow-400 mt-3">
              {stats.pendingTurfs}
            </h2>
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-wrap gap-5">

          <Link
            to="/admin/pending-turfs"
            className="bg-yellow-600 hover:bg-yellow-700 transition px-6 py-3 rounded-lg font-semibold"
          >
            Pending Turf Approvals
          </Link>

          <Link
            to="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
          >
            Manage Users
          </Link>

<Link
  to="/admin/manage-turfs"
  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold"
>
  Manage Turfs
</Link>




        </div>

      </div>
    </div>
  );
}