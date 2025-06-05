const express = require("express");
const router = express.Router();
const { protect } = require("../../../middleware/auth");
const { idCreator } = require("../../../lib/function");
const MaintainanceLog = require("../../../models/asset/maintainence/MaintainanceLog");

router.get("/", protect, async (req, res) => {
  try {
    const logs = await MaintainanceLog.find().populate({
        path: "asset",
        select: "_id ID",
      }).populate({
        path: "performedBy",
        select: "_id ID name",
      });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create log

router.post("/", protect, async (req, res) => {
  try {
  
    const log_id = await idCreator({
      model: MaintainanceLog,
      idStr: "MNLG",
    });

    const log = new MaintainanceLog({
      ...req.body,
      ID: log_id,
    });

    await log.save();

    const newLog = await MaintainanceLog.findById(log_id._id).populate({
        path: "asset",
        select: "_id ID",
      }).populate({
        path: "performedBy",
        select: "_id ID name",
      });

    res.status(201).json(newLog);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update log
router.put("/:id", protect, async (req, res) => {
  try {
    const log = await MaintainanceLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "log not found" });
    }
    Object.assign(log, req.body);
    log.updatedAt = Date.now();
    await log.save();

    const updatedLog = await MaintainanceLog.findById(req.params.id).populate({
        path: "asset",
        select: "_id ID",
      }).populate({
        path: "performedBy",
        select: "_id ID name",
      });

    res.json(updatedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete log
router.delete("/:id", protect, async (req, res) => {
  try {
    const log = await MaintainanceLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "log not found" });
    }
    await log.deleteOne();
    res.json({ message: "log deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
