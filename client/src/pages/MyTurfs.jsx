import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVendorTurfs,
  deleteTurf,
} from "../services/turfService";

export default function MyTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const res = await getVendorTurfs();
      setTurfs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load turfs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this turf?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTurf(id);

      alert("Turf deleted successfully");

      fetchTurfs();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete turf"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#08120c] text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          My Turfs
        </h1>

        {turfs.length === 0 ? (
          <div className="bg-[#12221a] rounded-xl p-8">
            No Turfs Added Yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-[#12221a] rounded-xl overflow-hidden"
              >

                <img
                  src={
                    turf.photos?.length
                      ? turf.photos[0]
                      : "https://placehold.co/600x400?text=TurfBook"
                  }
                  alt={turf.name}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <h2 className="text-2xl font-bold">
                    {turf.name}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    📍 {turf.city}
                  </p>

                  <p className="text-emerald-400 font-bold mt-4">
                    ₹{turf.pricePerSlot}
                  </p>

                  <div className="mt-5 flex gap-2 flex-wrap">

  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
      turf.status === "approved"
        ? "bg-green-700"
        : turf.status === "pending"
        ? "bg-yellow-600"
        : turf.status === "rejected"
        ? "bg-red-700"
        : "bg-gray-700"
    }`}
  >
    {turf.status?.charAt(0).toUpperCase() +
      turf.status?.slice(1)}
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      turf.isActive
        ? "bg-blue-700"
        : "bg-gray-700"
    }`}
  >
    {turf.isActive ? "Active" : "Inactive"}
  </span>

</div>

                  <div className="flex gap-3 mt-6">

                  <Link
  to={`/vendor/edit/${turf._id}`}
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
>
  Edit
</Link>

                    <button
                      onClick={() =>
                        handleDelete(turf._id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}