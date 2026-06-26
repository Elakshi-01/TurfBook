import { Link } from "react-router-dom";

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-emerald-400 mb-2">
          Vendor Dashboard
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your turfs and bookings.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <Link
            to="/vendor/turfs"
            className="bg-[#12221a] rounded-xl p-8 hover:bg-[#173125] transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              My Turfs
            </h2>

            <p className="text-gray-400">
              View, edit and delete your turfs.
            </p>
          </Link>

          <Link
            to="/vendor/add-turf"
            className="bg-[#12221a] rounded-xl p-8 hover:bg-[#173125] transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Add Turf
            </h2>

            <p className="text-gray-400">
              Add a new sports turf.
            </p>
          </Link>

          <Link
            to="/vendor/bookings"
            className="bg-[#12221a] rounded-xl p-8 hover:bg-[#173125] transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Bookings
            </h2>

            <p className="text-gray-400">
              View customer bookings.
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
}