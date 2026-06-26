/**
 * Generates the full list of 1-hour slots for a turf between its
 * opening and closing time, marking each as available or booked
 * based on existing bookings for that date.
 *
 * @param {string} openTime          e.g. "09:00"
 * @param {string} closeTime         e.g. "22:00"
 * @param {Array}  existingBookings  array of bookings, each expected to
 *                                   have a `startTime` field (e.g. "18:00")
 *                                   representing an already-booked slot
 *
 * @returns {Array<{ startTime: string, endTime: string, available: boolean }>}
 */
const generateSlots = (openTime, closeTime, existingBookings = []) => {
  const slots = [];

  // ── Parse "HH:00" strings into plain hour integers ──────────────────────
  const openHour = parseInt(openTime.split(":")[0], 10);
  const closeHour = parseInt(closeTime.split(":")[0], 10);

  // ── Build a quick-lookup Set of already-booked start times ──────────────
  const bookedStartTimes = new Set(
    existingBookings.map((booking) => booking.startTime)
  );

  // ── Generate each 1-hour slot from openHour up to closeHour ─────────────
  for (let hour = openHour; hour < closeHour; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

    slots.push({
      startTime,
      endTime,
      available: !bookedStartTimes.has(startTime),
    });
  }

  return slots;
};

module.exports = { generateSlots };