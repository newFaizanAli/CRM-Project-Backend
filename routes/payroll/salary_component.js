const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const SalaryComponent = require("../../models/payroll/SalaryComponent");
const { idCreator } = require("../../lib/function");

// Get all salary component
router.get("/", protect, async (req, res) => {
  try {
    const salary_components = await SalaryComponent.find();

    res.json(salary_components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new salary component
router.post("/", protect, async (req, res) => {
  try {
    const comp_id = await idCreator({
      model: SalaryComponent,
      idStr: "SALCMP",
    });

    const salary_component = new SalaryComponent({
      ...req.body,
      createdBy: req.user.id,
      ID: comp_id,
    });

    await salary_component.save();

    const newSalaryComponent = await SalaryComponent.findById(
      salary_component._id
    );

    res.status(201).json(newSalaryComponent);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update salary component
router.put("/:id", protect, async (req, res) => {
  try {
    const salary_component = await SalaryComponent.findById(req.params.id);
    if (!salary_component) {
      return res.status(404).json({ message: "Salary component not found" });
    }

    Object.assign(salary_component, req.body);
    salary_component.updatedAt = Date.now();
    await salary_component.save();

    const updatedSalaryComponent = await SalaryComponent.findById(
      salary_component._id
    );

    res.json(updatedSalaryComponent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete salary component
router.delete("/:id", protect, async (req, res) => {
  try {
    const salary_component = await SalaryComponent.findById(req.params.id);

    if (!salary_component) {
      return res.status(404).json({ message: "Salary component not found" });
    }

    await salary_component.deleteOne();

    res.json({ message: "Salary component deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
