const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Department = require("../models/Department");
const { idCreator } = require("../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const departments = await Department.find()
      .populate({ path: "parentDepartment", select: "_id ID name" })
      .populate({
        path: "manager",
        select: "_id name ID",
      });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create department

router.post("/", protect, async (req, res) => {
  try {
    const dept_id = await idCreator({
      model: Department,
      idStr: "DEPT",
    });

    const department = new Department({
      ...req.body,
      createdBy: req.user.id,
      ID: dept_id,
    });

    department.save()

    const newDepartment = await Department.findById(department._id)
      .populate({ path: "parentDepartment", select: "_id ID name" })
      .populate({
        path: "manager",
        select: "_id name ID",
      });

    res.status(201).json(newDepartment);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update department
router.put("/:id", protect, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    Object.assign(department, req.body);
    department.updatedAt = Date.now();

     await department.save();

    const updatedDepartment = await Department.findById(req.params.id)
      .populate({ path: "parentDepartment", select: "_id ID name" })
      .populate({
        path: "manager",
        select: "_id name ID",
      });

    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete department
router.delete("/:id", protect, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "department not found" });
    }
    await department.deleteOne();
    res.json({ message: "department deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
