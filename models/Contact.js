const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    personType: {
      type: String,
      enum: ["customers", "suppliers", "employees"],
      required: true,
    },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "personType",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contacts", contactSchema);
