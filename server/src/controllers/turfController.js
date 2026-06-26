const Turf = require("../models/Turf");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "TurfBook/Turfs",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// @desc    Get all turfs
// @route   GET /api/turfs
// @access  Public
const getTurfs = async (req, res) => {
  try {
    const { sport, location } = req.query;

    const filter = {
      isApproved: true,
      isActive: true,
    };

    if (sport) {
      filter.sports = sport.toLowerCase();
    }

    if (location) {
      filter.city = { $regex: location, $options: "i" };
    }

    const turfs = await Turf.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: turfs.length,
      data: turfs,
    });
  } catch (error) {
    console.error("getTurfs error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single turf
// @route   GET /api/turfs/:id
// @access  Public
const getTurfById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Turf ID",
      });
    }

    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    res.status(200).json({
      success: true,
      data: turf,
    });
  } catch (error) {
    console.error("getTurfById error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create turf
// @route   POST /api/turfs
// @access  Private (Vendor/Admin)
const createTurf = async (req, res) => {
  try {
    let photos = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        photos.push(uploaded.secure_url);
      }
    }

    // Convert sports string into array
    let sports = req.body.sports;

    if (typeof sports === "string") {
      sports = sports
        .split(",")
        .map((sport) => sport.trim().toLowerCase());
    }

   const turf = await Turf.create({
  ...req.body,
  sports,
  vendorId: req.user._id,
  photos,
  status: "pending",
  isApproved: false,
  isActive: false,
});

    res.status(201).json({
      success: true,
      data: turf,
    });
  } catch (error) {
    console.error("createTurf error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private (Owner Vendor/Admin)
const updateTurf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Turf ID",
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    const isOwner = turf.vendorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this turf",
      });
    }

    if (req.files && req.files.length > 0) {
      let photos = [];

      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        photos.push(uploaded.secure_url);
      }

      req.body.photos = photos;
    }

// Convert sports string into array
if (typeof req.body.sports === "string") {
  req.body.sports = req.body.sports
    .split(",")
    .map((sport) => sport.trim().toLowerCase());
}
req.body.status = "pending";
req.body.isApproved = false;
req.body.isActive = false;




    const updatedTurf = await Turf.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedTurf,
    });
  } catch (error) {
    console.error("updateTurf error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get Vendor Turfs
// @route   GET /api/turfs/vendor/my
// @access  Private (Vendor)
const getVendorTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({
      vendorId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: turfs.length,
      data: turfs,
    });
  } catch (error) {
    console.error("getVendorTurfs error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private (Owner Vendor/Admin)
const deleteTurf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Turf ID",
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    const isOwner =
      turf.vendorId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this turf",
      });
    }

    await Turf.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Turf deleted successfully",
    });
  } catch (error) {
    console.error("deleteTurf error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// @desc    Get Featured Turfs
// @route   GET /api/turfs/featured
// @access  Public
const getFeaturedTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({
      isApproved: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: turfs,
    });
  } catch (error) {
    console.error("getFeaturedTurfs error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getTurfs,
  getTurfById,
  getFeaturedTurfs,
  getVendorTurfs,
  createTurf,
  updateTurf,
  deleteTurf,
};