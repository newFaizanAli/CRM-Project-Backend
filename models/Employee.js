const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  ID: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  hireDate: {
    type: Date,
    require: true,
  },
  department: {
     type: mongoose.Schema.Types.ObjectId,
       ref: "departments",
   default: null,
  },
  position: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  types: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("employees", employeeSchema);
