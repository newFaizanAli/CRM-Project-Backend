const mongoose = require("mongoose");

const workstationTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "Cutting", "Welding", "Assembly"
    },
    description: {
      type: String,
    },
    defaultCostPerHour: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("WorkstationType", workstationTypeSchema);
