const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    workstation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workstation",
      required: true,
    },
    defaultTimeInMinutes: {
      type: Number,
      default: 30,
    },
    costPerHour: {
      type: Number,
      required: true,
      default: 0, // Start with 0, let pre-save handle the default
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

operationSchema.pre("save", async function (next) {
  // Only proceed if costPerHour is 0 or not set
  if (!this.costPerHour && this.costPerHour !== 0) {
    return next(); // Let the required validation handle this
  }

  if (this.costPerHour === 0) {
    try {
      // Ensure workstation is populated or fetch it
      if (!this.populated("workstation")) {
        this.workstation = await mongoose.model("Workstation")
          .findById(this.workstation)
          .populate("type");
      }
      
      if (this.workstation?.type?.defaultCostPerHour) {
        this.costPerHour = this.workstation.type.defaultCostPerHour;
      }
    } catch (err) {
      console.error("Error fetching workstation:", err);
      // Keep costPerHour as 0 if there's an error
    }
  }
  next();
});

module.exports = mongoose.model("Operation", operationSchema);