const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getPendingTurfs,
  getAllTurfs,
  approveTurf,
  rejectTurf,
  deactivateTurf,
  getAllUsers,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminOnly");

// =======================================
// Dashboard
// =======================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboard
);

// =======================================
// Turf Management
// =======================================

// All Turfs
router.get(
  "/turfs",
  protect,
  adminOnly,
  getAllTurfs
);

// Pending Turfs
router.get(
  "/turfs/pending",
  protect,
  adminOnly,
  getPendingTurfs
);

// Approve Turf
router.patch(
  "/turfs/:id/approve",
  protect,
  adminOnly,
  approveTurf
);

// Reject Turf
router.patch(
  "/turfs/:id/reject",
  protect,
  adminOnly,
  rejectTurf
);

// Deactivate Turf
router.patch(
  "/turfs/:id/deactivate",
  protect,
  adminOnly,
  deactivateTurf
);

// =======================================
// User Management
// =======================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

module.exports = router;