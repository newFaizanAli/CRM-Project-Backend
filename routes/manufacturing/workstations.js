const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const Workstaion = require("../../models/manufacturing/Workstation");
const { idCreator } = require("../../lib/function");

// ✅ Get all workstations
router.get("/", protect, async (req, res) => {
  try {
    const workstations = await Workstaion.find().populate({
      path: "type",
      select: "_id name defaultCostPerHour",
    });

    res.json(workstations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new workstaion
router.post("/", protect, async (req, res) => {
  try {
    const ws_id = await idCreator({
      model: Workstaion,
      idStr: "MFWS",
    });

    const workstaion = new Workstaion({
      ...req.body,
      createdBy: req.user.id,
      ID: ws_id,
    });

    await workstaion.save();

    const newWorkstaion = await Workstaion.findById(workstaion._id).populate({
      path: "type",
      select: "_id name defaultCostPerHour",
    });
    
    res.status(201).json(newWorkstaion);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update workstation
router.put("/:id", protect, async (req, res) => {
  try {
    const workstaion = await Workstaion.findById(req.params.id);
    if (!workstaion) {
      return res.status(404).json({ message: "workstaion not found" });
    }

    Object.assign(workstaion, req.body);
    workstaion.updatedAt = Date.now();
    await workstaion.save();

    const updatedWorkstaion = await Workstaion.findById(
      workstaion._id
    ).populate({
      path: "type",
      select: "_id name defaultCostPerHour",
    });

    res.json(updatedWorkstaion);
  } catch (error) { 
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete workstation
router.delete("/:id", protect, async (req, res) => {
  try {
    const workstaion = await Workstaion.findById(req.params.id);
    if (!workstaion) {
      return res.status(404).json({ message: "Workstaion not found" });
    }

    await workstaion.deleteOne();
    res.json({ message: "workstaion deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
