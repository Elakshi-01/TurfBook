const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    sports: [
      {
        type: String,
        enum: ["cricket", "football", "badminton", "tennis"],
      },
    ],

    photos: [
      {
        type: String,
      },
    ],

    openTime: {
      type: String,
      required: true,
    },

    closeTime: {
      type: String,
      required: true,
    },

    pricePerSlot: {
      type: Number,
      required: true,
      min: 0,
    },

status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},

isApproved: {
  type: Boolean,
  default: false,
},

isActive: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Turf", turfSchema);