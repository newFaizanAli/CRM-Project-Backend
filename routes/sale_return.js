const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const SaleReturns = require("../models/SaleReturn");
const handleSaleStockEntry = require("../lib/handleSaleStockEntry");

router.get("/", protect, async (req, res) => {
  try {
    const sale_returns = await SaleReturns.find()
      .populate({ path: "saleInvoice", select: "_id items ID totalAmount" })
      .populate({
        path: "customer",
        select: "_id name",
      });

    res.json(sale_returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create sale rteurn

router.post("/", protect, async (req, res) => {
  try {
    const sale_return = new SaleReturns({
      ...req.body,
      createdBy: req.user.id,
    });

    await sale_return.save();

    // 🔄 Run stock logic only if status is "Accepted"
    if (sale_return.status === "Accepted") {
      await handleSaleStockEntry({
        source: sale_return,
        userId: req.user.id,
        type: "Return",
        direction: "IN",
      });
    }

    const newReturn = await SaleReturns.findById(sale_return._id)
      .populate({ path: "saleInvoice", select: "_id items ID totalAmount" })
      .populate({
        path: "customer",
        select: "_id name",
      });

    res.status(201).json(newReturn);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update return
router.put("/:id", protect, async (req, res) => {
  try {
    const sale_return = await SaleReturns.findById(req.params.id);
    if (!sale_return) {
      return res.status(404).json({ message: "Sale return not found" });
    }

    Object.assign(sale_return, req.body);
    sale_return.updatedAt = Date.now();

    await sale_return.save();

     if (sale_return.status === "Accepted") {
      await handleSaleStockEntry({
        source: sale_return,
        userId: req.user.id,
        type: "Return",
        direction: "IN",
      });
    }

    const updatedReturn = await SaleReturns.findById(req.params.id)
      .populate({ path: "saleInvoice", select: "_id items ID totalAmount" })
      .populate({
        path: "customer",
        select: "_id name",
      });

    res.json(updatedReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete return
router.delete("/:id", protect, async (req, res) => {
  try {
    const sale_return = await SaleReturns.findById(req.params.id);
    if (!sale_return) {
      return res.status(404).json({ message: "return not found" });
    }
    await sale_return.deleteOne();
    res.json({ message: "sale return deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
