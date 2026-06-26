const mongoose = require("mongoose");
const Turf = require("../models/Turf");
const Booking = require("../models/Booking");
const { generateSlots } = require("../utils/slotHelper");

// @desc    Get slot availability for a turf on a given date
// @route   GET /api/turfs/:id/availability?date=YYYY-MM-DD
// @access  Public
const getTurfAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turf ID",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date query parameter is required",
      });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      turfId: id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "confirmed",
    }).select("startTime");

    const slots = generateSlots(
      turf.openTime,
      turf.closeTime,
      existingBookings
    );

    return res.status(200).json({
      success: true,
      turfId: id,
      date,
      slots,
    });
  } catch (error) {
    console.error("getTurfAvailability error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  User
const createBooking = async (req, res) => {
  try {
    const { turfId, sport, date, startTime } = req.body;

    if (!turfId || !sport || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide turfId, sport, date and startTime",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turf ID",
      });
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    if (!turf.isApproved || !turf.isActive) {
      return res.status(400).json({
        success: false,
        message: "This turf is not available for booking",
      });
    }

    if (!turf.sports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `This turf does not offer ${sport}`,
      });
    }

    const startHour = parseInt(startTime.split(":")[0], 10);
    const openHour = parseInt(turf.openTime.split(":")[0], 10);
    const closeHour = parseInt(turf.closeTime.split(":")[0], 10);

    if (startHour < openHour || startHour >= closeHour) {
      return res.status(400).json({
        success: false,
        message: `Selected time is outside turf operating hours (${turf.openTime} - ${turf.closeTime})`,
      });
    }

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const startOfDay = new Date(parsedDate);

    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const conflict = await Booking.findOne({
      turfId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      startTime,
      status: "confirmed",
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "This slot has already been booked",
      });
    }

    const endTime = `${String(startHour + 1).padStart(2, "0")}:00`;

    let booking;

    try {
      booking = await Booking.create({
        userId: req.user.id,
        turfId,
        vendorId: turf.vendorId,
        sport: sport.toLowerCase(),
        date: parsedDate,
        startTime,
        endTime,
        totalAmount: turf.pricePerSlot,
      });
    } catch (createError) {
      if (createError.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "This slot has already been booked",
        });
      }

      throw createError;
    }

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("createBooking error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  User
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate("turfId", "name city address photos")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("getMyBookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
// @access  Vendor
const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendorId: req.user.id,
    })
      .populate("turfId", "name city address")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("getVendorBookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  User / Vendor / Admin
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isOwner =
      booking.userId.toString() === req.user.id;

    const isVendor =
      booking.vendorId.toString() === req.user.id;

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isVendor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("cancelBooking error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getTurfAvailability,
  createBooking,
  getMyBookings,
  getVendorBookings,
  cancelBooking,
};