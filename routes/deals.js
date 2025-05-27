const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Deal = require("../models/Deal");

// Get all deals
router.get("/", protect, async (req, res) => {
  try {
    const deals = await Deal.find().populate({
      path: "company",
      select: "_id ID name",
    });

   
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new deal
router.post("/", protect, async (req, res) => {
  try {
    const deal = new Deal({
      ...req.body,
      createdBy: req.user.id,
    });

    await deal.save();

     const newDeal = await Deal.find().populate({
      path: "company",
      select: "_id ID name",
    });

    res.status(201).json(newDeal);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update deal
router.put("/:id", protect, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    Object.assign(deal, req.body);
    deal.updatedAt = Date.now();
    await deal.save();

    const updatedDeal = await Deal.find().populate({
      path: "company",
      select: "_id ID name",
    });
    
    res.json(updatedDeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete deal
router.delete("/:id", protect, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    await deal.deleteOne();

    res.json({ message: "Deal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
