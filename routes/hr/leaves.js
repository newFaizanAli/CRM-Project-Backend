const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const Leave = require("../../models/hr/Leave");

router.get("/", protect, async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employee",
      select: "_id ID name",
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add leave

router.post("/", protect, async (req, res) => {
  try {
    const leave = new Leave({
      ...req.body,
      createdBy: req.user.id,
    });

    leave.save();

    const newLeave = await Leave.findById(leave._id).populate({
      path: "employee",
      select: "_id ID name",
    });

    res.status(201).json(newLeave);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update leavce

router.put("/:id", protect, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "leave not found" });
    }

    Object.assign(leave, req.body);
    leave.updatedAt = Date.now();

    await leave.save();

    const updatedLeave = await Leave.findById(req.params.id).populate(
      { path: "employee", select: "_id ID name" }
    );

    res.json(updatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete leave
router.delete("/:id", protect, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "leave not found" });
    }
    await leave.deleteOne();
    res.json({ message: "leave deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
