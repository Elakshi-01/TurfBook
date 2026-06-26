const Turf = require("../models/Turf");
const Booking = require("../models/Booking");

const getHomeData = async (req, res) => {
  try {
    // Only approved & active turfs
    const turfs = await Turf.find({
      isApproved: true,
      isActive: true,
    });
    // Featured Turfs
    const featuredTurfs = turfs.slice(0, 3);

    // Stats
    const totalTurfs = turfs.length;

    const totalBookings = await Booking.countDocuments();

    const totalCities = [...new Set(turfs.map((t) => t.city))].length;

    // Sports Count
    const sportsMap = {};

    turfs.forEach((turf) => {
      turf.sports.forEach((sport) => {
        sportsMap[sport] = (sportsMap[sport] || 0) + 1;
      });
    });

    const sports = Object.keys(sportsMap).map((sport) => ({
      sport,
      count: sportsMap[sport],
    }));

    res.json({
      success: true,
      data: {
        featuredTurfs,
        totalTurfs,
        totalBookings,
        totalCities,
        sports,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getHomeData,
};