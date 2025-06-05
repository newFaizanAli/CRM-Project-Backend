const mongoose = require("mongoose");

const workstationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    capacityPerHour: {
      type: Number,
      default: 0, // optional: number of units can be processed per hour
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkstationType",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workstation", workstationSchema);
