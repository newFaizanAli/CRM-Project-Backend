const mongoose = require("mongoose");

const workstationSchema = new mongoose.Schema(
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
    location: {
      type: String,
    },
    capacityPerHour: {
      type: Number,
      default: 0,
    },
    costPerHour: {
      type: Number,
      required: true,
      default: 0, // Start with 0, pre-save will override if needed
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkstationType",
      required: true,
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

workstationSchema.pre("save", async function (next) {
  // Only override if costPerHour is explicitly 0
  if (this.costPerHour === 0) {
    try {
      // If 'type' is not populated, fetch it
      if (!this.populated("type")) {
        const workstationType = await mongoose.model("WorkstationType").findById(this.type);
        if (workstationType?.defaultCostPerHour) {
          this.costPerHour = workstationType.defaultCostPerHour;
        }
      } else if (this.type?.defaultCostPerHour) {
        // If 'type' is already populated, use its default
        this.costPerHour = this.type.defaultCostPerHour;
      }
    } catch (err) {
      console.error("Error fetching WorkstationType:", err);
      // Keep costPerHour as 0 if there's an error
    }
  }
  next();
});

module.exports = mongoose.model("Workstation", workstationSchema);