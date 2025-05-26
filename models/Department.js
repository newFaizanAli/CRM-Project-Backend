const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ID: {
      type: String,
      required: true,
    },
    parentDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees", 
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("departments", departmentSchema);



