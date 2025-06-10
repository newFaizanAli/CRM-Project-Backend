const mongoose = require("mongoose");


const bomSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // finished product
      required: true,
      unique: true,
    },
    version: {
      type: String,
      default: "v1.0",
    },
    rawMaterials: [bomItemSchema], // array of raw items
    operations: [bomOperationSchema], // array of operations
    totalCost: {
      type: Number,
      default: 0,
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

module.exports =
 mongoose.model("BOM", bomSchema);