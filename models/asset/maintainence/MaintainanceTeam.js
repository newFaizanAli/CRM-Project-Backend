const mongoose = require("mongoose");

const maintainanceTeamSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    members: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MaintainanceTeam", maintainanceTeamSchema);
