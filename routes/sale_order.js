const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { idCreator } = require("../lib/function");
const SaleOrder = require("../models/SaleOrder");

router.get("/", protect, async (req, res) => {
  try {
    const sale_orders = await SaleOrder.find()
     .populate({path: "customer", select: "_id name ID"})
      .populate("createdBy")
      .populate({
        path: "items.product",
        select: "_id name sellingPrice", 
      });

    res.json(sale_orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new order

router.post("/", protect, async (req, res) => {
  try {
    const order_id = await idCreator({
      model: SaleOrder,
      idStr: "SORDER",
    });

    const order = new SaleOrder({
      ...req.body,
      createdBy: req.user.id,
      ID: order_id,
    });

    await order.save();

    const newOrder = await SaleOrder.findById(order._id)
      .populate({path: "customer", select: "_id name ID"})
      .populate("createdBy")
       .populate({
        path: "items.product",
        select: "_id name sellingPrice", 
      });


    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update order
router.put("/:id", protect, async (req, res) => {
  try {
    const order = await SaleOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    Object.assign(order, req.body);
    order.updatedAt = Date.now();
    await order.save();

    const updatedOrder = await SaleOrder.findById(req.params.id)
      .populate({path: "customer", select: "_id name ID"})
      .populate("createdBy")
       .populate({
        path: "items.product",
        select: "_id name sellingPrice", 
      });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete order
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await SaleOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    await order.deleteOne();
    res.json({ message: "order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
