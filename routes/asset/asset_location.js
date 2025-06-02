const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const AssetLocation = require("../../models/asset/AssetLocation");
const { idCreator } = require("../../lib/function");

// ✅ Get all asset locations
router.get("/", protect, async (req, res) => {
  try {
    const asset_locations = await AssetLocation.find()
      .populate({
        path: "department",
        select: "_id ID name",
      })
      .populate({
        path: "inCharge",
        select: "_id ID name",
      });
    res.json(asset_locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create new asset location
router.post("/", protect, async (req, res) => {
  try {
    const comp_id = await idCreator({
      model: AssetLocation,
      idStr: "ASLT",
    });

    const asset_location = new AssetLocation({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    await asset_location.save();

    const newAssetLocation = await AssetLocation.findById(asset_location._id)
      .populate({
        path: "department",
        select: "_id ID name",
      })
      .populate({
        path: "inCharge",
        select: "_id ID name",
      });
    res.status(201).json(newAssetLocation);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update asset location
router.put("/:id", protect, async (req, res) => {
  try {
    const asset_location = await AssetLocation.findById(req.params.id);
    if (!asset_location) {
      return res.status(404).json({ message: "Asset location not found" });
    }

    Object.assign(asset_location, req.body);
    asset_location.updatedAt = Date.now();
    await asset_location.save();

    const updatedAssetLocation = await AssetLocation.findById(
      asset_location._id
    )
      .populate({
        path: "department",
        select: "_id ID name",
      })
      .populate({
        path: "inCharge",
        select: "_id ID name",
      });
    res.json(updatedAssetLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete asset location
router.delete("/:id", protect, async (req, res) => {
  try {
    const asset_location = await AssetLocation.findById(req.params.id);
    if (!asset_location) {
      return res.status(404).json({ message: "Asset location not found" });
    }

    await asset_location.deleteOne();
    res.json({ message: "Asset location deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
