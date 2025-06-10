
const mongoose = require("mongoose");

const manufacturingItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products", // raw material product reference
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  uom: {
    type: String, // unit of measure
    default: "pcs",
  },
  rate: {
    type: Number,
    default: 0, // cost per unit (optional)
  },
});


module.exports = mongoose.model("ManufacturingItem", manufacturingItemSchema);