const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const SalaryStructure = require("../../models/payroll/SalaryStructure");
const { idCreator } = require("../../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const salary_structures = await SalaryStructure.find()
      .populate({
        path: "components.component",
        select: "_id type value name amountType",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.json(salary_structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create salary structure

router.post("/", protect, async (req, res) => {
  try {


    const comp_id = await idCreator({
      model: SalaryStructure,
      idStr: "SALSTR",
    });

    const salary_structure = new SalaryStructure({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    await salary_structure.save();

    const newSalaryStructure = await SalaryStructure.findById(
      salary_structure._id
    )
      .populate({
        path: "components.component",
        select: "_id type value name amountType",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.status(201).json(newSalaryStructure);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update salary structure
router.put("/:id", protect, async (req, res) => {
  try {
    const salary_structure = await SalaryStructure.findById(req.params.id);
    if (!salary_structure) {
      return res.status(404).json({ message: "Salary structure not found" });
    }
    Object.assign(salary_structure, req.body);
    salary_structure.updatedAt = Date.now();
    await salary_structure.save();

    const updatedSalaryStructure = await SalaryStructure.findById(req.params.id)
      .populate({
        path: "components.component",
        select: "_id type value name amountType",
      })
      .populate({
        path: "employee",
        select: "_id name",
      });

    res.json(updatedSalaryStructure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete salary structure
router.delete("/:id", protect, async (req, res) => {
  try {
    const salary_structure = await SalaryStructure.findById(req.params.id);
    if (!salary_structure) {
      return res.status(404).json({ message: "salary structure not found" });
    }
    await salary_structure.deleteOne();
    res.json({ message: "salary structure deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
