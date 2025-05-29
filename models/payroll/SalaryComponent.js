const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Earning", "Deduction"],
      required: true,
    },
    amountType: {
      type: String,
      enum: ["Fixed", "Percentage"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("SalaryComponent", salaryComponentSchema);
