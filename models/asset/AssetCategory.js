const mongoose = require("mongoose");

const assetCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Computers", "Vehicles"
    },
    ID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    depreciationMethod: {
      type: String,
      enum: ["Straight Line", "Declining Balance", "None"],
      default: "None",
    },
    usefulLifeInYears: {
      type: Number,
      default: 0,
    },
    salvageValue: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("AssetCategory", assetCategorySchema);
