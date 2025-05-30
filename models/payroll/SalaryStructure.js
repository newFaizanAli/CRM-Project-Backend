const mongoose = require("mongoose");

const salaryStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    base: {
      type: Number,
      required: true,
    },
    components: [
      {
        component: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SalaryComponent",
          required: true,
        }
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
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



module.exports = mongoose.model("SalaryStructure", salaryStructureSchema);
