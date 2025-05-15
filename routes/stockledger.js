const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const StockLedger = require("../models/StockLedger");

// Get all stock entries
router.get("/", protect, async (req, res) => {
  try {
    const entries = await StockLedger.find()
      .populate({
        path: "product",
        select: "name _id",
        options: { strictPopulate: false },
      })
      .populate({
        path: "warehouse",
        select: "name _id",
        options: { strictPopulate: false },
      })
      .populate({
        path: "entryRefId",
        select: "_id ID",
        options: { strictPopulate: false },
      });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
