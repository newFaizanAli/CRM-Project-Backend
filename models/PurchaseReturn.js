const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'suppliers',
      required: true,
    },
    returnDate: {
      type: Date,
      default: Date.now,
    },
    purchaseReceipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'purchase-receipt',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rate: Number,
        amount: Number,
      },
    ],
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Cancelled'],
      default: 'Draft',
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("purchase-return", purchaseReturnSchema);
