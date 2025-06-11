const mongoose = require("mongoose");

const bomSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    rawMaterials: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          default: 0,
        },
      },
    ],
    operations: [
      {
        operation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Operation",
          required: true,
        },
        timeInMinutes: {
          type: Number,
        },
        costPerHour: {
          type: Number,
        },
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
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

bomSchema.pre("save", async function (next) {
  try {
    for (let op of this.operations) {
      const operationDoc = await mongoose
        .model("Operation")
        .findById(op.operation);


      if (!operationDoc) {
        throw new Error(`Operation not found for ID: ${op.operation}`);
      }

      // Assign default time if not provided
      if (op.timeInMinutes == null || op.timeInMinutes == 0) {
        op.timeInMinutes = operationDoc.defaultTimeInMinutes || 30;
      }

      // Assign default costPerHour if not provided
      if (op.costPerHour == null || op.costPerHour == 0) {
        op.costPerHour = operationDoc.costPerHour || 0;
      }
    }


 

    next();
  } catch (err) {
    console.error("Error in BOM pre-save:", err);
    next(err);
  }
});

module.exports = mongoose.model("BOM", bomSchema);
