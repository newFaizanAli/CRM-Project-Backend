const mongoose = require("mongoose");

const assetLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Head Office", "Store Room A"
    },
    ID: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null, // optional: e.g., "IT Department", "Finance"
    },
    inCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees", // optional: person responsible at this location
      default: null,
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

module.exports = mongoose.model("AssetLocation", assetLocationSchema);
