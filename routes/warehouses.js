const express = require("express");
const router = express.Router();
const { idCreator } = require("../lib/function");
const { protect } = require("../middleware/auth");
const Warehouse = require("../models/Warehouse");


// Get all warehouses
router.get("/", protect, async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new warehouse
router.post("/", protect, async (req, res) => {
  try {
    const wrh_id = await idCreator({
      model: Warehouse,
      idStr: "WRH",
    });

    const warehouse = new Warehouse({
      ...req.body,
      createdBy: req.user.id,
      ID: wrh_id,
    });

    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update warehouse
router.put("/:id", protect, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    Object.assign(warehouse, req.body);
    warehouse.updatedAt = Date.now();
    const updatedWarehouse = await warehouse.save();
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete warehouse
router.delete("/:id", protect, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    await warehouse.deleteOne();

    res.json({ message: "Warehouse deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
