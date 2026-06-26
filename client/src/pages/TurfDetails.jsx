import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMapPin, FiClock, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { getSingleTurf } from "../services/turfService";
import {
  getAvailability,
  createBooking,
} from "../services/bookingService";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date) {
  // Local YYYY-MM-DD, matches what <input type="date"> used to send
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: toDateKey(d),
      dayLabel: DAY_LABELS[d.getDay()],
      dateLabel: d.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

export default function TurfDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);

  const dateOptions = useState(buildNext7Days())[0];
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].key);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Gallery / lightbox state
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetchTurf();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
    setSelectedSlot("");
  }, [selectedDate]);

  // ESC to close lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, activeImage, turf]);

  const fetchTurf = async () => {
    try {
      const res = await getSingleTurf(id);

      setTurf(res.data);

      if (res.data.sports.length > 0) {
        setSelectedSport(res.data.sports[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      setSlotsLoading(true);
      const res = await getAvailability(id, selectedDate);
      setSlots(res.slots || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate)
      return alert("Please select a date.");

    if (!selectedSlot)
      return alert("Please select a slot.");

    try {
      setBookingLoading(true);

      await createBooking({
        turfId: id,
        sport: selectedSport,
        date: selectedDate,
        startTime: selectedSlot,
      });

      alert("Booking Successful!");

      navigate("/my-bookings");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const photos = turf?.photos?.length
    ? turf.photos
    : ["https://placehold.co/700x500?text=TurfBook"];

  const openLightbox = (index) => {
    setActiveImage(index);
    setLightboxOpen(true);
  };

  const nextImage = useCallback(() => {
    setActiveImage((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prevImage = useCallback(() => {
    setActiveImage((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-2xl">
        Turf Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08120c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* ═══════════════════════════════════
            GALLERY
        ═══════════════════════════════════ */}
        <div>
          <button
            onClick={() => openLightbox(0)}
            className="block w-full rounded-xl overflow-hidden relative group"
          >
            <img
              src={photos[0]}
              alt={turf.name}
              className="w-full h-[450px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {photos.length > 1 && (
              <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                +{photos.length - 1} more
              </span>
            )}
          </button>

          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {photos.slice(0, 4).map((src, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className="rounded-lg overflow-hidden h-20 relative group"
                >
                  <img
                    src={src}
                    alt={`${turf.name} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  {i === 3 && photos.length > 4 && (
                    <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-sm font-bold">
                      +{photos.length - 4}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════
            DETAILS / BOOKING
        ═══════════════════════════════════ */}
        <div>

          <h1 className="text-5xl font-bold text-emerald-400">
            {turf.name}
          </h1>

          <p className="mt-6 text-gray-300">
            {turf.description}
          </p>

          <div className="mt-8 space-y-3 text-lg">
            <p className="flex items-center gap-2">
              <FiMapPin className="text-emerald-400" /> {turf.city}
            </p>
            <p className="text-gray-400 text-base">{turf.address}</p>
            <p className="capitalize">🏅 {turf.sports.join(", ")}</p>
            <p className="flex items-center gap-2">
              <FiClock className="text-emerald-400" /> {turf.openTime} - {turf.closeTime}
            </p>
          </div>

          <h2 className="text-4xl font-bold text-emerald-400 mt-8">
            ₹{turf.pricePerSlot}
            <span className="text-xl text-gray-400"> / slot</span>
          </h2>

          {/* ── Date strip (7-day calendar) ── */}
          <div className="mt-8">
            <label className="block mb-3 font-semibold">
              Select Date
            </label>

            <div className="grid grid-cols-7 gap-2">
              {dateOptions.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDate(d.key)}
                  className={`flex flex-col items-center py-3 rounded-xl border transition-all ${
                    selectedDate === d.key
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-[#12221a] border-white/10 text-gray-300 hover:border-emerald-500/40"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-70">
                    {d.isToday ? "Today" : d.dayLabel}
                  </span>
                  <span className="text-lg font-bold mt-0.5">{d.dateLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-semibold">
              Select Sport
            </label>

            <select
              value={selectedSport}
              onChange={(e) =>
                setSelectedSport(e.target.value)
              }
              className="w-full bg-[#12221a] p-3 rounded-lg capitalize"
            >
              {turf.sports.map((sport) => (
                <option key={sport} className="capitalize">
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* ── Slots ── */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Available Slots —{" "}
                {dateOptions.find((d) => d.key === selectedDate)?.isToday
                  ? "Today"
                  : `${dateOptions.find((d) => d.key === selectedDate)?.dayLabel}, ${selectedDate}`}
              </h3>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#12221a] border border-white/20 inline-block" /> Open
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-600/60 inline-block" /> Booked
                </span>
              </div>
            </div>

            {slotsLoading ? (
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-gray-500 text-sm">No slots available for this date.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.startTime}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.startTime)}
                    className={`p-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      !slot.available
                        ? "bg-red-600/20 text-red-400 border border-red-600/30 cursor-not-allowed"
                        : selectedSlot === slot.startTime
                        ? "bg-emerald-500 border-2 border-white"
                        : "bg-[#12221a] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-600/20"
                    }`}
                  >
                    {slot.startTime}
                    <span className="text-xs">
                      {!slot.available ? "❌" : selectedSlot === slot.startTime ? "✅" : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 py-4 rounded-xl text-lg font-bold disabled:opacity-60 transition-colors"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>

        </div>

      </div>

      {/* ═══════════════════════════════════
          LIGHTBOX
      ═══════════════════════════════════ */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            aria-label="Close"
          >
            <FiX size={28} />
          </button>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white p-2"
              aria-label="Previous image"
            >
              <FiChevronLeft size={32} />
            </button>
          )}

          <img
            src={photos[activeImage]}
            alt={`${turf.name} ${activeImage + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
          />

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white p-2"
              aria-label="Next image"
            >
              <FiChevronRight size={32} />
            </button>
          )}

          {photos.length > 1 && (
            <span className="absolute bottom-6 text-white/60 text-sm">
              {activeImage + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}