const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    ID: {
      type: String, 
    },
    type: {
      type: String,
      enum: ["payment", "receipt"], // payment = supplier, receipt = customer
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "bank"],
      default: "cash",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    partyType: {
      type: String,
      enum: ["customers", "suppliers"],
      required: true,
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "partyType", // dynamic ref based on partyType
    },
    referenceInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel", // dynamic reference
    },
    referenceModel: {
      type: String,
      enum: ["purchase-invoice", "sales-invoice"],
    },
    notes: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional if you're tracking who added the transaction
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("transaction", transactionSchema);
 