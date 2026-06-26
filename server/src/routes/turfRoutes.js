const express = require("express");
const router = express.Router();

const {
  getTurfs,
  getFeaturedTurfs,
  getTurfById,
  getVendorTurfs,
  createTurf,
  updateTurf,
  deleteTurf,
} = require("../controllers/turfController");

const {
  getTurfAvailability,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/vendorOnly");
const upload = require("../middleware/upload");

// ======================
// Public Routes
// ======================

// Get all turfs
router.get("/", getTurfs);

// Vendor's own turfs
// IMPORTANT: Must come before "/:id"
router.get(
  "/vendor/my",
  protect,
  vendorOnly,
  getVendorTurfs
);

// Turf availability
// IMPORTANT: Must come before "/:id"
router.get(
  "/:id/availability",
  getTurfAvailability
);

// Featured Turfs
router.get("/featured", getFeaturedTurfs);

// Get single turf
router.get("/:id", getTurfById);

// ======================
// Vendor Routes
// ======================

// Create Turf
router.post(
  "/",
  protect,
  vendorOnly,
  upload.array("photos", 5),
  createTurf
);

// Update Turf
router.put(
  "/:id",
  protect,
  vendorOnly,
  upload.array("photos", 5),
  updateTurf
);

// Delete Turf
router.delete(
  "/:id",
  protect,
  vendorOnly,
  deleteTurf
);

module.exports = router;