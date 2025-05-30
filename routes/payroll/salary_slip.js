const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const SalarySlip = require("../../models/payroll/SalarySlip");

router.get("/", protect, async (req, res) => {
  try {
    const salary_slips = await SalarySlip.find()
      .populate({
        path: "components.component",
        select: "_id type value",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.json(salary_slips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create salary slip

router.post("/", protect, async (req, res) => {
  try {
    const salary_slip = new SalarySlip({
      ...req.body,
      createdBy: req.user.id,
    });

    await salary_slip.save();

    const newSalarySlip = await SalarySlip.findById(salary_slip._id)
      .populate({
        path: "components.component",
        select: "_id type value",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.status(201).json(newSalarySlip);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update salary slip
router.put("/:id", protect, async (req, res) => {
  try {
    const salary_slip = await SalarySlip.findById(req.params.id);
    if (!salary_slip) {
      return res.status(404).json({ message: "Salary slip not found" });
    }
    Object.assign(salary_slip, req.body);
    salary_slip.updatedAt = Date.now();
    await salary_slip.save();

    const updatedSalarySlip = await SalarySlip.findById(req.params.id)
      .populate({
        path: "components.component",
        select: "_id type value",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.json(updatedSalarySlip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete salary slip
router.delete("/:id", protect, async (req, res) => {
  try {
    const salary_slip = await SalarySlip.findById(req.params.id);
    if (!salary_slip) {
      return res.status(404).json({ message: "salary slip not found" });
    }
    await salary_slip.deleteOne();
    res.json({ message: "salary slip deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
