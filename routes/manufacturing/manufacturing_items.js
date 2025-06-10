const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const ManufacturingItem = require("../../models/manufacturing/ManufacturingItems");
const { idCreator } = require("../../lib/function");

// ✅ Get all items
router.get("/", protect, async (req, res) => {
  try {
    const products = await ManufacturingItem.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new item
router.post("/", protect, async (req, res) => {
  try {
    const item_id = await idCreator({
      model: ManufacturingItem,
      idStr: "MFIT",
    });

    const item = new ManufacturingItem({
      ...req.body,
      createdBy: req.user.id,
      ID: item_id,
    });

    await item.save();

    const newItem = await ManufacturingItem.findById(item._id);

    res.status(201).json(newItem);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update manufacturing_item
router.put("/:id", protect, async (req, res) => {
  try {
    const manufacturing_item = await ManufacturingItem.findById(req.params.id);
    if (!manufacturing_item) {
      return res.status(404).json({ message: "manufacturing item not found" });
    }

    Object.assign(manufacturing_item, req.body);
    manufacturing_item.updatedAt = Date.now();
    await manufacturing_item.save();

    const updatedManufacturingItem = await ManufacturingItem.findById(
      manufacturing_item._id
    );

    res.json(updatedManufacturingItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete item
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await ManufacturingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Manufacturing Item not found" });
    }

    await item.deleteOne();
    res.json({ message: "Manufacturing item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
