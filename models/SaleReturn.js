const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
  {
    saleInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sales-invoice",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    returnDate: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
    },
    stockEntered: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    remarks: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sales-return", salesReturnSchema);
