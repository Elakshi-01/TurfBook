const mongoose = require("mongoose");
const Turf = require("../models/Turf");
const User = require("../models/User");

const Booking = require("../models/Booking");



const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalTurfs = await Turf.countDocuments();

    const totalBookings = await Booking.countDocuments();

 const pendingTurfs = await Turf.countDocuments({
  status: "pending",
});

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTurfs,
        totalBookings,
        pendingTurfs,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all turfs pending approval
// @route   GET /api/admin/turfs/pending
// @access  Admin
const getPendingTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ status: "pending" }).populate(
      "vendorId",
      "name email phone"
    );

    return res.status(200).json({
      success: true,
      count: turfs.length,
      turfs,
    });
  } catch (error) {
    console.error("getPendingTurfs error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Approve a pending turf
// @route   PATCH /api/admin/turfs/:id/approve
// @access  Admin
const approveTurf = async (req, res) => {
  try {
    const { id } = req.params;

    // ── 1. Validate turf ID format ───────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turf ID",
      });
    }

    // ── 2. Find the turf ──────────────────────────────────────────────────────
    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // ── 3. Approve and activate ─────────────────────────────────────────────
   turf.status = "approved";
turf.isApproved = true;
turf.isActive = true;

await turf.save();

    return res.status(200).json({
      success: true,
      message: "Turf approved successfully",
      turf,
    });
  } catch (error) {
    console.error("approveTurf error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Reject a pending turf
// @route   PATCH /api/admin/turfs/:id/reject
// @access  Admin
const rejectTurf = async (req, res) => {
  try {
    const { id } = req.params;

    // ── 1. Validate turf ID format ───────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turf ID",
      });
    }

    // ── 2. Find the turf ──────────────────────────────────────────────────────
    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // ── 3. Reject ────────────────────────────────────────────────────────────
  turf.status = "rejected";
turf.isApproved = false;
turf.isActive = false;

await turf.save();
    return res.status(200).json({
      success: true,
      message: "Turf rejected",
      turf,
    });
  } catch (error) {
    console.error("rejectTurf error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Deactivate a previously-approved turf
// @route   PATCH /api/admin/turfs/:id/deactivate
// @access  Admin
const deactivateTurf = async (req, res) => {
  try {
    const { id } = req.params;

    // ── 1. Validate turf ID format ───────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turf ID",
      });
    }

    // ── 2. Find the turf ──────────────────────────────────────────────────────
    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // ── 3. Deactivate only — isApproved is left untouched ───────────────────
  turf.status = "deactivated";
turf.isActive = false;

await turf.save();
    return res.status(200).json({
      success: true,
      message: "Turf deactivated",
      turf,
    });
  } catch (error) {
    console.error("deactivateTurf error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get all users, optionally filtered by role
// @route   GET /api/admin/users?role=user|vendor|admin
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    // ── 1. Validate role query param if provided ─────────────────────────────
    const validRoles = ["user", "vendor", "admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role filter must be one of: user, vendor, admin",
      });
    }

    // ── 2. Build query filter ────────────────────────────────────────────────
    const filter = role ? { role } : {};

    // ── 3. Fetch users, explicitly excluding password ───────────────────────
    const users = await User.find(filter).select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().populate(
      "vendorId",
      "name email phone"
    );

    res.status(200).json({
      success: true,
      count: turfs.length,
      turfs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getPendingTurfs,
  approveTurf,
  rejectTurf,
  deactivateTurf,
  getAllUsers,
  getAllTurfs,
  getDashboard,
};