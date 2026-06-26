import { useEffect, useState } from "react";
import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-20">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-emerald-400">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <h2>No bookings yet.</h2>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#12221a] rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {booking.turfId.name}
              </h2>

              <p>{booking.turfId.city}</p>

              <p>
                {new Date(booking.date).toDateString()}
              </p>

              <p>
                {booking.startTime} - {booking.endTime}
              </p>

              <p>₹{booking.totalAmount}</p>

              <p className="capitalize">
                {booking.status}
              </p>

              {booking.status === "confirmed" && (
                <button
                  onClick={() =>
                    handleCancel(booking._id)
                  }
                  className="mt-4 bg-red-600 px-5 py-2 rounded-lg"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}