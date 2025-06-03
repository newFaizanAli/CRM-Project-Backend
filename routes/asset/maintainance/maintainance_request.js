const express = require("express");
const router = express.Router();
const { protect } = require("../../../middleware/auth");
const { idCreator } = require("../../../lib/function");
const MaintainanceRequest = require("../../../models/asset/maintainence/MaintananceRequest");

router.get("/", protect, async (req, res) => {
  try {
    const requests = await MaintainanceRequest.find()
      .populate({
        path: "asset",
        select: "_id ID",
      })
      .populate({
        path: "reportedBy",
        select: "_id ID name",
      })
      .populate({
        path: "assignedTo",
        select: "_id ID name",
      });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create request

router.post("/", protect, async (req, res) => {
  try {
    const request_id = await idCreator({
      model: MaintainanceRequest,
      idStr: "MNRQ",
    });

    const request = new MaintainanceRequest({
      ...req.body,
      ID: request_id,
    });

    await request.save();

    const newRequest = await MaintainanceRequest.findById(request_id._id)
      .populate({
        path: "asset",
        select: "_id ID",
      })
      .populate({
        path: "reportedBy",
        select: "_id ID name",
      })
      .populate({
        path: "assignedTo",
        select: "_id ID name",
      });

    res.status(201).json(newRequest);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update request
router.put("/:id", protect, async (req, res) => {
  try {
    const request = await MaintainanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "request not found" });
    }
    Object.assign(request, req.body);
    request.updatedAt = Date.now();
    await request.save();

    const updatedRequest = await MaintainanceRequest.findById(req.params.id)
      .populate({
        path: "asset",
        select: "_id ID",
      })
      .populate({
        path: "reportedBy",
        select: "_id ID name",
      })
      .populate({
        path: "assignedTo",
        select: "_id ID name",
      });

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete request
router.delete("/:id", protect, async (req, res) => {
  try {
    const request = await MaintainanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "request not found" });
    }
    await request.deleteOne();
    res.json({ message: "request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
