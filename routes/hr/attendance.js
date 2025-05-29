const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const Attendance = require("../../models/hr/Attendance");

router.get("/", protect, async (req, res) => {
  try {
    const attendances = await Attendance.find().populate({
      path: "employee",
      select: "_id ID name",
    });

    
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// mark attendance

router.post("/", protect, async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      createdBy: req.user.id,
    });

    attendance.save();

    const newAttendance = await Attendance.findById(attendance._id).populate({
      path: "employee",
      select: "_id ID name",
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update attendance
router.put("/:id", protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    Object.assign(attendance, req.body);
    attendance.updatedAt = Date.now();

    await attendance.save();

    const updatedAttendance = await Attendance.findById(req.params.id).populate(
      { path: "employee", select: "_id ID name" }
    );

    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance
router.delete("/:id", protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    await attendance.deleteOne();
    res.json({ message: "attendance deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
