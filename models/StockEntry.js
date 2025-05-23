const mongoose = require("mongoose");

const stockEntrySchema = new mongoose.Schema(
  {
    ID : {
      type : String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouses",
      required: true,
    },
    entryType: {
      type: String,
      enum: ["Opening Stock", "Purchase", "Adjustment", "Return", "Transfer", "Sale"],
      required: true,
    },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true }, 
    entryDate: { type: Date, default: Date.now },
    remarks: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stockentry", stockEntrySchema);
