const mongoose = require("mongoose");

const salesInvoiceSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouses",
      required: true,
    },
    saleOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sales-order",
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
    stockEntered: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("sales-invoice", salesInvoiceSchema);
