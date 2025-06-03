const express = require("express");
const router = express.Router();
const { protect } = require("../../../middleware/auth");
const { idCreator } = require("../../../lib/function");
const MaintainanceTeam = require("../../../models/asset/maintainence/MaintainanceTeam");

router.get("/", protect, async (req, res) => {
  try {
    const maintainance_teams = await MaintainanceTeam.find().populate({
      path: "manager",
      select: "_id ID name",
    });

    res.json(maintainance_teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create maintence team

router.post("/", protect, async (req, res) => {
  try {
    const maintainence_id = await idCreator({
      model: MaintainanceTeam,
      idStr: "MNTM",
    });

    const maintainence_team = new MaintainanceTeam({
      ...req.body,
      ID: maintainence_id,
    });

    await maintainence_team.save();

    const newMaintainenceTeam = await MaintainanceTeam.findById(
      maintainence_id._id
    ).populate({
      path: "manager",
      select: "_id ID name",
    });

    res.status(201).json(newMaintainenceTeam);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update team
router.put("/:id", protect, async (req, res) => {
  try {
    const team = await MaintainanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "team not found" });
    }
    Object.assign(team, req.body);
    team.updatedAt = Date.now();
    await team.save();

    const updatedTeam = await MaintainanceTeam.findById(req.params.id).populate({
      path: "manager",
      select: "_id ID name",
    });

    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete team
router.delete("/:id", protect, async (req, res) => {
  try {
    const team = await MaintainanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "team not found" });
    }
    await team.deleteOne();
    res.json({ message: "team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
