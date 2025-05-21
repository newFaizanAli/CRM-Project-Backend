const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const PurchaseReturns = require("../models/PurchaseReturn");
const { idCreator } = require("../lib/function");
const handleStockEntry = require("../lib/handleStockEntery");

router.get("/", protect, async (req, res) => {
  try {
    const purchase_returns = await PurchaseReturns.find()
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate({
        path: "supplier",
        select: "_id name",
      });
    res.json(purchase_returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create purchase rteurn

router.post("/", protect, async (req, res) => {
  try {
    const purchase_return = new PurchaseReturns({
      ...req.body,
      createdBy: req.user.id,
    });

    await purchase_return.save(); // 🔄 Save first

    // 🔄 Run stock logic only if status is "Submitted"
    if (purchase_return.status === "Submitted") {
      await handleStockEntry({
        source: purchase_return,
        userId: req.user.id,
        type: "PurchaseReturn",
        direction: "OUT",
      });
    }

    const newReturn = await PurchaseReturns.findById(purchase_return._id)
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate({ path: "supplier", select: "_id name" });

    res.status(201).json(newReturn);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});


// Update return
router.put("/:id", protect, async (req, res) => {
  try {
    const pur_return = await PurchaseReturns.findById(req.params.id);
    if (!pur_return) {
      return res.status(404).json({ message: "Purchase return not found" });
    }

    Object.assign(pur_return, req.body);
    pur_return.updatedAt = Date.now();

    await pur_return.save(); // 🔄 Save before stock logic

    if (pur_return.status === "Submitted") {
      await handleStockEntry({
        source: pur_return,
        userId: req.user.id,
        type: "PurchaseReturn",
        direction: "OUT",
      });
    }

    const updatedReturn = await PurchaseReturns.findById(req.params.id)
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate({ path: "supplier", select: "_id name" });

    res.json(updatedReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete return
router.delete("/:id", protect, async (req, res) => {
  try {
    const pur_return = await PurchaseReturns.findById(req.params.id);
    if (!pur_return) {
      return res.status(404).json({ message: "return not found" });
    }
    await pur_return.deleteOne();
    res.json({ message: "purchase return deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
