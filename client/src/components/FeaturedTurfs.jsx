import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedTurfs } from "../services/turfService";

export default function FeaturedTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const res = await getFeaturedTurfs();
      setTurfs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#08120c] text-center text-white">
        Loading Featured Turfs...
      </section>
    );
  }

  if (turfs.length === 0) return null;

  return (
    <section className="bg-[#08120c] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-emerald-400 mb-3">
          Featured Turfs
        </h2>

        <p className="text-center text-gray-400 mb-12">
          Explore the best sports venues near you.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-[#12221a] rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
            >
              <img
                src={
                  turf.photos?.length
                    ? turf.photos[0]
                    : "https://placehold.co/600x400?text=TurfBook"
                }
                alt={turf.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-2xl font-bold text-white">
                  {turf.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  📍 {turf.city}
                </p>

                <p className="text-gray-300 mt-2">
                  ⚽ {turf.sports.join(", ")}
                </p>

                <p className="text-emerald-400 text-2xl font-bold mt-4">
                  ₹{turf.pricePerSlot}
                  <span className="text-sm text-gray-400">
                    {" "}
                    /slot
                  </span>
                </p>

                <Link
                  to={`/turfs/${turf._id}`}
                  className="block mt-6 bg-emerald-500 hover:bg-emerald-600 text-center py-3 rounded-lg font-semibold"
                >
                  Book Now
                </Link>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}