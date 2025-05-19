const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const PurchaseReceipts = require("../models/PurchaseReceipt");
const { idCreator } = require("../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const purchase_receipts = await PurchaseReceipts.find()
      .populate({ path: "purchaseOrder", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      })
      .populate({
        path: "warehouse",
        select: "_id name location",
      });

    res.json(purchase_receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create purchase receipt

router.post("/", protect, async (req, res) => {
  try {
    const receipt_id = await idCreator({
      model: PurchaseReceipts,
      idStr: "PRECEIPT",
    });

    const receipt = new PurchaseReceipts({
      ...req.body,
      createdBy: req.user.id,
      ID: receipt_id,
    });

    await receipt.save();

    const newReceipt = await PurchaseReceipts.findById(receipt._id)
      .populate({ path: "purchaseOrder", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      })
      .populate({
        path: "warehouse",
        select: "_id name location",
      });

    res.status(201).json(newReceipt);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update receipt
router.put("/:id", protect, async (req, res) => {
  try {
    const receipt = await PurchaseReceipts.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    Object.assign(receipt, req.body);
    receipt.updatedAt = Date.now();
    await receipt.save();

    const updatedReceipt = await PurchaseReceipts.findById(req.params.id)
      .populate({ path: "purchaseOrder", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      })
      .populate({
        path: "warehouse",
        select: "_id name location",
      });

    res.json(updatedReceipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete receipt
router.delete("/:id", protect, async (req, res) => {
  try {
    const receipt = await PurchaseReceipts.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: "receipt not found" });
    }
    await receipt.deleteOne();
    res.json({ message: "receipt deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
