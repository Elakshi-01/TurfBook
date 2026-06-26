import { useEffect, useState } from "react";
import {
  getVendorBookings,
  cancelBooking,
} from "../services/bookingService";

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getVendorBookings();

      setBookings(res.bookings || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load vendor bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await cancelBooking(bookingId);

      alert("Booking cancelled successfully");

      fetchBookings();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#08120c] text-white text-2xl">
        Loading Vendor Bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08120c] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">
          Vendor Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-[#12221a] rounded-xl p-6">
            <p className="text-lg text-gray-300">
              No bookings found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#12221a] rounded-xl p-6 border border-[#1f3a2b]"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-400">
                      {booking.turfId?.name || "Turf"}
                    </h2>

                    <p className="text-gray-300 mt-2">
                      📍 {booking.turfId?.city}
                    </p>

                    <p className="mt-4">
                      <strong>Customer:</strong>{" "}
                      {booking.userId?.name}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {booking.userId?.email}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {booking.userId?.phone}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        booking.date
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Time:</strong>{" "}
                      {booking.startTime} -{" "}
                      {booking.endTime}
                    </p>

                    <p>
                      <strong>Sport:</strong>{" "}
                      {booking.sport}
                    </p>

                    <p>
                      <strong>Amount:</strong> ₹
                      {booking.totalAmount}
                    </p>

                    <p className="mt-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          booking.status === "confirmed"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
                </div>

                {booking.status === "confirmed" && (
                  <button
                    onClick={() =>
                      handleCancel(booking._id)
                    }
                    className="mt-6 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}