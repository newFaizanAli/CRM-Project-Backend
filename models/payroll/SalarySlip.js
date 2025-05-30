const mongoose = require("mongoose");

const salarySlipSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    salaryStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryStructure",
      required: true,
    },
    // baseSalary: Number, -> salary structure
    month: String,
    year: Number,
    components: [
      {
        component: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SalaryComponent",
          required: true,
        },
      },
    ],
    // totalEarnings: Number,
    // totalDeductions: Number,
    // netPay: Number,
    status: {
      type: String,
      enum: ["Draft", "Final"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SalarySlip", salarySlipSchema);
