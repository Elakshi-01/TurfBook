const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getVendorBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/vendorOnly");

// @route   POST /api/bookings
// @access  User
router.post("/", protect, createBooking);

// @route   GET /api/bookings/my
// @access  User
router.get("/my", protect, getMyBookings);

// @route   GET /api/bookings/vendor
// @access  Vendor
router.get("/vendor", protect, vendorOnly, getVendorBookings);

// @route   PATCH /api/bookings/:id/cancel
// @access  User (own) / Vendor (own turf) / Admin (any)
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;