const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true // e.g., AST0001
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetCategory',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetLocation',
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  purchaseCost: {
    type: Number,
    required: true
  },
  vendor: {
    type: String // Optional: vendor name or ref
  },

//   depreciationMethod
//   usefulLifeInYears
//   salvageValue 

  currentValue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Use', 'Idle', 'Scrapped', 'Sold', 'Under Maintenance'],
    default: 'In Use'
  },
  warrantyExpiry: {
    type: Date
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Asset', assetSchema);
