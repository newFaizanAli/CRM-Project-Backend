const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "lead"],
      default: "active",
    },
    type: {
      type: String,
      enum: ["Regular", "Walk-in", "Wholesale", "Retail"],
      default: "Regular",
    },
    notes: {
      type: String,
    },
    remarks: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customers", customerSchema);
