const mongoose = require("mongoose");
const { StockEntryTypes } = require("../lib/const");

const stockLedgerSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
      required: true,
    },
    entryType: {
      type: String,
      enum: StockEntryTypes,
      required: true,
    },
    entryRefId: { type: mongoose.Schema.Types.ObjectId }, 
    quantity: { type: Number, required: true },
    direction: { type: String, enum: ["IN", "OUT"], required: true }, 
    balance: { type: Number }, 
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("stockledger", stockLedgerSchema);

