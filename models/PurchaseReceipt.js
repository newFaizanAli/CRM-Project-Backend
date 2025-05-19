const mongoose = require("mongoose");

const purchaseReceiptSchema = new mongoose.Schema(
  {
     ID : {
      type: String,
    },
    purchaseOrder: {
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
        receivedQty: {
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
    receiptDate: {
      type: Date,
      default: Date.now,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouses",
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Received", "Cancelled"],
      default: "Draft",
    },
    remarks: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("purchase-receipt", purchaseReceiptSchema);
