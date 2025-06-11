const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const BOM = require("../../models/manufacturing/BOM");
const { idCreator } = require("../../lib/function");

// ✅ Get all bills
router.get("/", protect, async (req, res) => {
  try {
    const bills = await BOM.find()
      .populate({
        path: "product",
        select: "_id name ID",
      })
      .populate({
        path: "rawMaterials.product",
        select: "_id name quantity rate ID",
      })
      .populate({
        path: "operations.operation",
        select: "_id name timeInMinutes costPerHour rate ID",
      });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new bom
router.post("/", protect, async (req, res) => {
  try {
    const bom_id = await idCreator({
      model: BOM,
      idStr: "MBOM",
    });

    const bill = new BOM({
      ...req.body,
      createdBy: req.user.id,
      ID: bom_id,
    });

    await bill.save();

    const newBill = await BOM.findById(bill._id)
      .populate({
        path: "product",
        select: "_id name ID",
      })
      .populate({
        path: "rawMaterials.product",
        select: "_id name quantity rate ID",
      })
      .populate({
        path: "operations.operation",
        select: "_id name timeInMinutes costPerHour rate ID",
      });

    res.status(201).json(newBill);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update bill
router.put("/:id", protect, async (req, res) => {
  try {
    const bill = await BOM.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    Object.assign(bill, req.body);
    bill.updatedAt = Date.now();
    await bill.save();

    const updatedBill = await BOM.findById(bill._id)
      .populate({
        path: "product",
        select: "_id name ID",
      })
      .populate({
        path: "rawMaterials.product",
        select: "_id name quantity rate ID",
      })
      .populate({
        path: "operations.operation",
        select: "_id name timeInMinutes costPerHour rate ID",
      });

    res.json(updatedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete bill
router.delete("/:id", protect, async (req, res) => {
  try {
    const bill = await BOM.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    await bill.deleteOne();
    res.json({ message: "bill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
