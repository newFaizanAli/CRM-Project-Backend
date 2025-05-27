const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Company = require("../models/Comapny");
const { idCreator } = require("../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const companies = await Company.find().populate({
      path: "parentCompany",
      select: "_id ID name",
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create company

router.post("/", protect, async (req, res) => {
  try {
    const comp_id = await idCreator({
      model: Company,
      idStr: "COMP",
    });

    const company = new Company({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    company.save();

    const newCompany = await Company.findById(company._id).populate({
      path: "parentCompany",
      select: "_id ID name",
    });

    res.status(201).json(newCompany);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update company
router.put("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    Object.assign(company, req.body);
    company.updatedAt = Date.now();

    await company.save();

    const updatedCompany = await Company.findById(req.params.id).populate({
      path: "parentCompany",
      select: "_id ID name",
    });

    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Company
router.delete("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "company not found" });
    }
    await company.deleteOne();
    res.json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
