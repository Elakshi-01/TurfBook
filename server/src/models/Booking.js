const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: [true, "Turf reference is required"],
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor reference is required"],
    },

    sport: {
      type: String,
      required: [true, "Sport is required"],
      trim: true,
      lowercase: true,
    },

    date: {
      type: Date,
      required: [true, "Booking date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [
        /^([01]\d|2[0-3]):00$/,
        "Start time must be on the hour (e.g. 18:00)",
      ],
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [
        /^([01]\d|2[0-3]):00$/,
        "End time must be on the hour (e.g. 19:00)",
      ],
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    cancelledBy: {
      type: String,
      enum: ["user", "vendor", "admin", null],
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking
bookingSchema.index(
  { turfId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "confirmed",
    },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;