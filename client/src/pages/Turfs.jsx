import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllTurfs } from "../services/turfService";
import { FiMapPin, FiX } from "react-icons/fi";

const SPORT_OPTIONS = ["football", "cricket", "badminton", "tennis"];

export default function Turfs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  const sport = searchParams.get("sport") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    fetchTurfs();
  }, [sport, location]);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const res = await getAllTurfs({ sport, location });
      setTurfs(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setSport = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set("sport", val);
    else next.delete("sport");
    setSearchParams(next);
  };

  const setLocationFilter = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set("location", val);
    else next.delete("location");
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = sport || location;

  return (
    <div className="min-h-screen bg-[#08120c] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-emerald-400 mb-3">
          Available Turfs
        </h1>
        <p className="text-center text-gray-500 mb-10">
          {turfs.length} turf{turfs.length !== 1 ? "s" : ""} found
          {sport ? ` · ${sport}` : ""}
          {location ? ` · "${location}"` : ""}
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              defaultValue={location}
              onKeyDown={(e) => {
                if (e.key === "Enter") setLocationFilter(e.target.value);
              }}
              onBlur={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by city..."
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SPORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSport(sport === s ? "" : s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  sport === s
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:border-emerald-500/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400"
            >
              <FiX /> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#12221a] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-52 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/5 rounded w-2/3" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : turfs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏟</p>
            <p className="text-gray-400 text-lg">No turfs match your filters.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-emerald-400 hover:underline text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-[#12221a] rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-emerald-900/30 transition-all duration-300"
              >
                <img
                  src={
                    turf.photos?.length
                      ? turf.photos[0]
                      : "https://placehold.co/600x400?text=TurfBook"
                  }
                  alt={turf.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-semibold">{turf.name}</h2>

                  <p className="text-gray-400 mt-2 flex items-center gap-1">
                    <FiMapPin /> {turf.city}
                  </p>

                  <p className="text-gray-500 text-sm">{turf.address}</p>

                  {turf.sports?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {turf.sports.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-emerald-400 font-bold text-xl mt-4">
                    ₹{turf.pricePerSlot}/slot
                  </p>

                  <Link
                    to={`/turfs/${turf._id}`}
                    className="block mt-5 w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg font-semibold text-center transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}