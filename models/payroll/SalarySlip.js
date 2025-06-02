const mongoose = require("mongoose");

const salarySlipSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    salaryStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryStructure",
      required: true,
    },
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
