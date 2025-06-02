const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const Asset = require("../../models/asset/Asset"); 
const { idCreator } = require("../../lib/function");

// ✅ Get all assets
router.get("/", protect, async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new asset
router.post("/", protect, async (req, res) => {
  try {
    const comp_id = await idCreator({
      model: Asset,
      idStr: "ASST",
    });

    const asset = new Asset({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    await asset.save();

    const newAsset = await Asset.findById(asset._id);
    res.status(201).json(newAsset);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update asset
router.put("/:id", protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    Object.assign(asset, req.body);
    asset.updatedAt = Date.now();
    await asset.save();

    const updatedAsset = await Asset.findById(asset._id);
    res.json(updatedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete asset
router.delete("/:id", protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await asset.deleteOne();
    res.json({ message: "Asset deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
