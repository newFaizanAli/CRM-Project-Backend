const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Customer = require("../models/Customer");
const { idCreator } = require("../lib/function");

// Get all customers
router.get("/", protect, async (req, res) => {
  try {
    const customers = await Customer.find().populate("createdBy", "name email");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single customer
router.get("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new customer
router.post("/", protect, async (req, res) => {
  try {

    const customer_id = await idCreator({
      model: Customer,
      idStr: "CUS",
    });

    const customer = new Customer({
      ...req.body,
      createdBy: req.user.id,
      ID: customer_id
    });
    
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    Object.assign(customer, req.body);
    customer.updatedAt = Date.now();
    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer
router.delete("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.remove();
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
