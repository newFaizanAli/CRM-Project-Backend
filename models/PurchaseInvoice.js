const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
    },
    purchaseReceipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchase-order",
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
    totalAmount: {
      type: Number,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Unpaid", "Partially Paid", "Paid", "Cancelled"],
      default: "Unpaid",
    },
    remarks: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("purchase-invoice", purchaseInvoiceSchema);
