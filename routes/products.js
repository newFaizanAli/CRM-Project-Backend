const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Product = require("../models/Products");

router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "name _id",
      options: { strictPopulate: false },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new product

router.post("/", protect, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user.id,
    });

    await product.save();

    const newProduct = await Product.findById(product._id).populate({
      path: "category",
      select: "name _id",
      options: { strictPopulate: false },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});


// Update product
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    Object.assign(product, req.body);
    product.updatedAt = Date.now();
    await product.save();

    const updatedProduct = await Product.findById(req.params.id).populate({
      path: "category",
      select: "name _id",
      options: { strictPopulate: false },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    await product.deleteOne();
    res.json({ message: "product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
