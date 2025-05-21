const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const StockEntry = require("../models/StockEntry");
const StockLedger = require("../models/StockLedger");
const { StockEntryTypes } = require("../lib/const");
const { idCreator } = require("../lib/function");

// Get all stock entries
router.get("/", protect, async (req, res) => {
  try {
    const entries = await StockEntry.find()
      .populate({
        path: "product",
        select: "name _id",
        options: { strictPopulate: false },
      })
      .populate({
        path: "warehouse",
        select: "name _id",
        options: { strictPopulate: false },
      });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new stock entity

router.post("/", protect, async (req, res) => {
  try {
    const { product, warehouse, entryType, quantity } = req.body;

    if (entryType === "Opening Stock") {
      const existing = await StockEntry.findOne({
        product,
        warehouse,
        entryType: "Opening Stock",
      });

      if (existing) {
        return res.status(400).json({
          message:
            "Opening Stock already exists for this product in this warehouse.",
        });
      }
    }
    
    const stock_entity = new StockEntry({
      ...req.body,
      ID: `SE-${Date.now()}`,
    });

    await stock_entity.save();

  
    const direction = StockEntryTypes.includes(entryType) ? "IN" : "OUT";

    
    const lastEntry = await StockLedger.findOne({ product, warehouse })
      .sort({ date: -1 });

    const lastBalance = lastEntry?.balance || 0;

   
    const newBalance =
      direction === "IN"
        ? lastBalance + quantity
        : lastBalance - quantity;

   
    await StockLedger.create({
      product,
      warehouse,
      quantity,
      entryType,
      entryRefId: stock_entity._id,
      direction,
      balance: newBalance, 
    });

   
    const newStockEntry = await StockEntry.findById(stock_entity._id)
      .populate({
        path: "product",
        select: "name _id",
        options: { strictPopulate: false },
      })
      .populate({
        path: "warehouse",
        select: "name _id",
        options: { strictPopulate: false },
      });

    res.status(201).json(newStockEntry);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const stockEntryId = req.params.id;

    const stock_entity = await StockEntry.findById(stockEntryId);
    if (!stock_entity) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    // Get old ledger
    const currentLedger = await StockLedger.findOne({ entryRefId: stockEntryId });
    if (!currentLedger) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    // Update StockEntry
    Object.assign(stock_entity, req.body);
    await stock_entity.save();

    // Update Ledger
    const updatedDirection = StockEntryTypes.includes(req.body.entryType) ? "IN" : "OUT";
    currentLedger.product = req.body.product;
    currentLedger.warehouse = req.body.warehouse;
    currentLedger.quantity = req.body.quantity;
    currentLedger.entryType = req.body.entryType;
    currentLedger.direction = updatedDirection;
    await currentLedger.save();

    // ✅ Get previous balance just before this ledger
    const previousLedger = await StockLedger.findOne({
      product: currentLedger.product,
      warehouse: currentLedger.warehouse,
      $or: [
        { date: { $lt: currentLedger.date } },
        { date: currentLedger.date, _id: { $lt: currentLedger._id } },
      ],
    })
      .sort({ date: -1, _id: -1 });

    let balance = previousLedger ? previousLedger.balance : 0;

    // ✅ Get all ledgers after (or equal to) current ledger
    const futureLedgers = await StockLedger.find({
      product: currentLedger.product,
      warehouse: currentLedger.warehouse,
      $or: [
        { date: { $gt: currentLedger.date } },
        { date: currentLedger.date, _id: { $gte: currentLedger._id } },
      ],
    }).sort({ date: 1, _id: 1 });

    // ✅ Update balance moving forward
    for (let ledger of futureLedgers) {
      if (ledger.direction === "IN") {
        balance += ledger.quantity;
      } else {
        balance -= ledger.quantity;
      }
      ledger.balance = balance;
      await ledger.save();
    }

    const updatedStockEntity = await StockEntry.findById(stockEntryId)
      .populate({ path: "product", select: "name _id" })
      .populate({ path: "warehouse", select: "name _id" });

    res.json(updatedStockEntity);
  } catch (error) {
    console.error("Ledger update error:", error);
    res.status(400).json({ message: error.message });
  }
});


// Delete stock
router.delete("/:id", protect, async (req, res) => {
  try {
    const stock_entity = await StockEntry.findById(req.params.id);
    if (!stock_entity) {
      return res.status(404).json({ message: "stock entity not found" });
    }
    await stock_entity.deleteOne();

    await StockLedger.deleteOne({ entryRefId: req.params.id });

    res.json({ message: "stock entity deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
