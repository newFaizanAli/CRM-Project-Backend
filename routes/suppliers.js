const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Suppliers = require("../models/Supplier");
const { idCreator } = require("../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const suppliers = await Suppliers.find();

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new supplier

router.post("/", protect, async (req, res) => {
  try {
    const sup_id = await idCreator({
      model: Suppliers,
      idStr: "SUP",
    });

    const supplier = new Suppliers({
      ...req.body,
      createdBy: req.user.id,
      ID: sup_id,
    });

    await supplier.save();

    const newSupplier = await Suppliers.findById(supplier._id);

    res.status(201).json(newSupplier);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update supplier
router.put("/:id", protect, async (req, res) => {
  try {
    const supplier = await Suppliers.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    Object.assign(supplier, req.body);
    await supplier.save();

    const updatedSupplier = await Suppliers.findById(req.params.id);

    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete supplier
router.delete("/:id", protect, async (req, res) => {
  try {
    const supplier = await Suppliers.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "supplier not found" });
    }
    await supplier.deleteOne();
    res.json({ message: "supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
