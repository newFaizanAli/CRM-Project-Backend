const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const AssetCategory = require("../../models/asset/AssetCategory");
const { idCreator } = require("../../lib/function");

// ✅ Get all asset categories
router.get("/", protect, async (req, res) => {
  try {
    const asset_categories = await AssetCategory.find();
    res.json(asset_categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new asset category
router.post("/", protect, async (req, res) => {
  try {
    const comp_id = await idCreator({
      model: AssetCategory,
      idStr: "ASCT",
    });

    const asset_category = new AssetCategory({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    await asset_category.save();

    const newAssetCategory = await AssetCategory.findById(asset_category._id);
    res.status(201).json(newAssetCategory);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update asset category
router.put("/:id", protect, async (req, res) => {
  try {
    const asset_category = await AssetCategory.findById(req.params.id);
    if (!asset_category) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    Object.assign(asset_category, req.body);
    asset_category.updatedAt = Date.now();
    await asset_category.save();

    const updatedAssetCategory = await AssetCategory.findById(asset_category._id);
    res.json(updatedAssetCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete asset category
router.delete("/:id", protect, async (req, res) => {
  try {
    const asset_category = await AssetCategory.findById(req.params.id);
    if (!asset_category) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    await asset_category.deleteOne();
    res.json({ message: "Asset category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
