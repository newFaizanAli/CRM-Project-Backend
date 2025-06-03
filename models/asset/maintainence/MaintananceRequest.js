const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  requestDate: {
    type: Date,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees',
    required: true
  },
  problemDescription: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintainanceTeam',
    required: true
  },
  resolutionNote: {
    type: String
  },
  closedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
