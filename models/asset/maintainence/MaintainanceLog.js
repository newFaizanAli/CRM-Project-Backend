const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    maintenanceDate: {
      type: Date,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintainanceTeam",
      required: true,
    },
    type: {
      type: String,
      enum: ["Corrective", "Preventive"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    cost: {
      type: Number,
    },

    description: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);
