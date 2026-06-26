import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiZap,
  FiShield,
  FiStar,
  FiArrowRight,
  FiChevronRight,
  FiUsers,
  FiCircle,
} from "react-icons/fi";
import { getHomeData } from "../services/homeService";
import {
  GiSoccerBall,
  GiCricketBat,
  GiShuttlecock,
} from "react-icons/gi";
import { MdSportsTennis, MdSportsBasketball, MdSportsVolleyball } from "react-icons/md";

/* ─────────────────────────────────────────
   STATIC DATA (icons + features only — counts/labels come from backend)
───────────────────────────────────────── */
const SPORT_ICONS = {
  football: <GiSoccerBall />,
  cricket: <GiCricketBat />,
  tennis: <MdSportsTennis />,
  badminton: <GiShuttlecock />,
  basketball: <MdSportsBasketball />,
  volleyball: <MdSportsVolleyball />,
};

const FEATURES = [
  {
    icon: <FiZap />,
    title: "Instant Booking",
    desc: "Reserve your slot in under 60 seconds. No calls, no waiting — just pick a time and play.",
  },
  {
    icon: <FiShield />,
    title: "Verified Venues",
    desc: "Every turf is physically inspected and rated. What you see is exactly what you get.",
  },
  {
    icon: <FiCalendar />,
    title: "Flexible Scheduling",
    desc: "Book daily, weekly, or recurring slots. Cancel up to 4 hours before without any fee.",
  },
  {
    icon: <FiUsers />,
    title: "Team Management",
    desc: "Invite teammates, split the cost, and coordinate from a single shared dashboard.",
  },
];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();

  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [sports, setSports] = useState([]); // [{ sport, count }]
  const [stats, setStats] = useState({
    totalTurfs: 0,
    totalBookings: 0,
    totalCities: 0,
  });
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [query, setQuery] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);

  const [statsRef, statsVisible] = useInView();
  const [sportsRef, sportsVisible] = useInView();
  const [featuredRef, featuredVisible] = useInView();
  const [featuresRef, featuresVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await getHomeData();
      const data = res.data || {};

      setFeaturedTurfs(data.featuredTurfs || []);
      setSports(data.sports || []);
      setStats({
        totalTurfs: data.totalTurfs || 0,
        totalBookings: data.totalBookings || 0,
        totalCities: data.totalCities || 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/turfs${query ? `?location=${encodeURIComponent(query)}` : ""}`);
  };

  const goToSport = (sportKey) => {
    navigate(`/turfs?sport=${sportKey}`);
  };

  const quickTags = sports.length > 0
    ? sports.slice(0, 4).map((s) => s.sport)
    : ["football", "cricket", "badminton", "tennis"];

  return (
    <div className="min-h-screen bg-[#080f0a] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_70%,rgba(6,78,59,0.12),transparent)] pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <div
            className={`inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8 transition-all duration-700 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            🏟 {stats.totalTurfs}+ Verified Turfs Across India
          </div>

          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 transition-all duration-700 delay-100 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Find your
            <span className="block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                perfect turf
              </span>
            </span>
            <span className="text-slate-400 text-4xl sm:text-5xl md:text-6xl font-bold">
              book in seconds.
            </span>
          </h1>

          <p
            className={`text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Football, cricket, badminton, and more — instant bookings, zero hassle, always the right pitch.
          </p>

          <form
            onSubmit={handleSearch}
            className={`flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6 transition-all duration-700 delay-300 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="relative flex-1">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 text-lg pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, area or turf..."
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              <FiSearch className="text-base" />
              Find Turfs
            </button>
          </form>

          <div
            className={`flex flex-wrap justify-center gap-2 transition-all duration-700 delay-[400ms] ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => goToSport(tag)}
                className="px-4 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 text-xs font-medium transition-all duration-200 capitalize"
              >
                {SPORT_ICONS[tag] ? <span className="mr-1">{SPORT_ICONS[tag]}</span> : null}
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs text-slate-500 tracking-widest uppercase">Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="border-y border-white/5 bg-white/[0.02] py-10"
      >
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { value: `${stats.totalBookings}+`, label: "Bookings" },
            { value: `${stats.totalTurfs}+`, label: "Verified Turfs" },
            { value: `${stats.totalCities}`, label: "Cities" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`text-center transition-all duration-500 ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p className="text-3xl font-black text-emerald-400">{value}</p>
              <p className="text-xs uppercase text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SPORTS CARDS
      ═══════════════════════════════════════ */}
      <section
        ref={sportsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="mb-12">
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">Browse by sport</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            What do you play?
          </h2>
        </div>

        {sports.length === 0 ? (
          <p className="text-gray-500 text-sm">No sports data yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map(({ sport, count }, i) => (
              <button
                key={sport}
                onClick={() => goToSport(sport)}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 text-center cursor-pointer ${
                  sportsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 60}ms`, transitionDuration: "500ms" }}
              >
                <span className="text-3xl text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                  {SPORT_ICONS[sport] || <FiCircle />}
                </span>
                <span className="text-sm font-bold text-white capitalize">{sport}</span>
                <span className="text-[11px] text-slate-500">{count} Available</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          FEATURED TURFS
      ═══════════════════════════════════════ */}
      <section
        ref={featuredRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">Featured venues</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Top turfs this week
            </h2>
          </div>
          <button
            onClick={() => navigate("/turfs")}
            className="hidden sm:flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            View all <FiChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingFeatured ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden border border-white/8 animate-pulse"
              >
                <div className="w-full h-52 bg-white/5" />
                <div className="bg-[#0d1f13]/90 p-5 space-y-3">
                  <div className="h-5 bg-white/5 rounded w-2/3" />
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                  <div className="h-10 bg-white/5 rounded-xl mt-4" />
                </div>
              </div>
            ))
          ) : featuredTurfs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-5xl mb-4">🏟</p>
              <p className="text-gray-400">No featured turfs available.</p>
              <p className="text-gray-600 text-sm mt-1">Please check back later.</p>
            </div>
          ) : (
            featuredTurfs.map((turf, i) => (
              <div
                key={turf._id}
                className={`group relative rounded-3xl overflow-hidden border border-white/8 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-900/40 cursor-pointer ${
                  featuredVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
                onClick={() => navigate(`/turfs/${turf._id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      turf.photos?.length
                        ? turf.photos[0]
                        : "https://placehold.co/600x400?text=Turf"
                    }
                    alt={turf.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="bg-[#0d1f13]/90 p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{turf.name}</h3>
                      <p className="text-emerald-400 text-sm capitalize">
                        {turf.sports?.join(", ") || "—"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-lg">
                        ₹{turf.pricePerSlot}
                      </p>
                      <p className="text-xs text-gray-400">per slot</p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <FiMapPin />
                      {turf.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiStar className="text-yellow-400" />
                      New
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/turfs/${turf._id}`);
                    }}
                    className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] py-2 rounded-xl font-semibold transition-all"
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/turfs")}
          className="sm:hidden mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 text-sm font-semibold transition-all"
        >
          View all turfs <FiChevronRight />
        </button>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}
      <section
        ref={featuresRef}
        className="relative py-16 md:py-24 border-t border-white/5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(6,78,59,0.15),transparent)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">Why TurfBook</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight max-w-xl mx-auto">
              Everything you need, nothing you don't
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className={`p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms`, transitionDuration: "500ms" }}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mb-5">
                  {icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-10 md:p-16 text-center transition-all duration-700 ${
            ctaVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-emerald-200/80 text-xs font-bold uppercase tracking-widest mb-4">Ready to play?</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Your next match<br />starts here.
            </h2>
            <p className="text-emerald-100/70 max-w-md mx-auto text-base mb-10 leading-relaxed">
              Join thousands of players already booking with TurfBook. Free to sign up, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 font-black text-sm tracking-wide shadow-xl shadow-black/20 transition-all duration-200"
              >
                Create free account <FiArrowRight />
              </button>
              <button
                onClick={() => navigate("/turfs")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 font-bold text-sm tracking-wide transition-all duration-200"
              >
                Browse turfs
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}