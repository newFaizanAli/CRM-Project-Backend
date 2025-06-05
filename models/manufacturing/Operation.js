const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    workstation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workstation",
      required: true,
    },
    defaultTimeInMinutes: {
      type: Number,
      default: 30,
    },
    costPerHour: {
      type: Number,
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

module.exports = mongoose.model("Operation", operationSchema);

