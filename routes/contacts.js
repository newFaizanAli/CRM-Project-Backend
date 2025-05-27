const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Contact = require("../models/Contact");

// Get all contacts
router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate({
        path: "company",
        select: "_id ID name",
      })
      .populate("person", "ID name _id email phone");

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new contact
router.post("/", protect, async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      createdBy: req.user.id,
    });

    await contact.save();

    const newContact = await Contact.findById(contact._id)
      .populate({ path: "company", select: "_id ID name" })
      .populate("person", "ID name _id email phone");

    res.status(201).json(newContact);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update contact
router.put("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    Object.assign(contact, req.body);
    contact.updatedAt = Date.now();
    await contact.save();

    const updatedContact = await Contact.findById(req.params.id)
      .populate({ path: "company", select: "_id ID name" })
      .populate("person", "ID name _id email phone");

    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact
router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.deleteOne();

    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
