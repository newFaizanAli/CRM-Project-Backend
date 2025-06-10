const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const Operation = require("../../models/manufacturing/Operation");
const { idCreator } = require("../../lib/function");

// ✅ Get all operations
router.get("/", protect, async (req, res) => {
  try {

    const operations = await Operation.find().populate({
      path: "workstation",
      select: "_id name ID",
    });

    res.json(operations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new operation
router.post("/", protect, async (req, res) => {
  try {
    const op_id = await idCreator({
      model: Operation,
      idStr: "MFOP",
    });

    const operation = new Operation({
      ...req.body,
      createdBy: req.user.id,
      ID: op_id,
    });

    await operation.save();

    const newOperation = await Operation.findById(operation._id).populate({
      path: "workstation",
      select: "_id name ID",
    });
    
    res.status(201).json(newOperation);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update operations
router.put("/:id", protect, async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: "operation not found" });
    }

    Object.assign(operation, req.body);
    operation.updatedAt = Date.now();
    await operation.save();

    const updatedOperation = await Operation.findById(
      operation._id
    ).populate({
      path: "workstation",
      select: "_id name ID",
    });

    res.json(updatedOperation);
  } catch (error) { 
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete operation
router.delete("/:id", protect, async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: "operation not found" });
    }

    await operation.deleteOne();
    res.json({ message: "operation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
