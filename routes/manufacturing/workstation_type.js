const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const WorkstationType = require("../../models/manufacturing/WorkstaionType");
const { idCreator } = require("../../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const workstation_types = await WorkstationType.find();

    res.json(workstation_types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create workstation type

router.post("/", protect, async (req, res) => {
  try {
    const type_id = await idCreator({
      model: WorkstationType,
      idStr: "WSTP",
    });

    const workstaion_type = new WorkstationType({
      ...req.body,
      createdBy: req.user.id,
      ID: type_id,
    });

    workstaion_type.save();

    const newWorkstationType = await WorkstationType.findById(workstaion_type._id);

    res.status(201).json(newWorkstationType);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update workstation type
router.put("/:id", protect, async (req, res) => {
  try {
    const workstaion_type = await WorkstationType.findById(req.params.id);
    if (!workstaion_type) {
      return res.status(404).json({ message: "workstaion type not found" });
    }

    Object.assign(workstaion_type, req.body);
    workstaion_type.updatedAt = Date.now();

    await workstaion_type.save();

    const updatedWorkstationType = await WorkstationType.findById(req.params.id);

    res.json(updatedWorkstationType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete workstation
router.delete("/:id", protect, async (req, res) => {
  try {
    const workstaion_type = await WorkstationType.findById(req.params.id);
    if (!workstaion_type) {
      return res.status(404).json({ message: "workstaion type not found" });
    }
    await workstaion_type.deleteOne();
    res.json({ message: "Workstaion type deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
