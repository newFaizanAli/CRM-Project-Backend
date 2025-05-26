const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Project = require("../models/Project");
const { idCreator } = require("../lib/function");

router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({ path: "department", select: "_id ID name" })
      .populate({ path: "assignedTo", select: "_id ID name" });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new project

router.post("/", protect, async (req, res) => {
  try {
    const proj_id = await idCreator({
      model: Project,
      idStr: "PROJ",
    });

    const project = new Project({
      ...req.body,
      createdBy: req.user.id,
      ID: proj_id,
    });

    await project.save();

    const newProject = await Project.findById(project._id)
      .populate({ path: "department", select: "_id ID name" })
      .populate({ path: "assignedTo", select: "_id ID name" });

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    Object.assign(project, req.body);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate({ path: "department", select: "_id ID name" })
      .populate({ path: "assignedTo", select: "_id ID name" });
      
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    await project.deleteOne();
    res.json({ message: "project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
