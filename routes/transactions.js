const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { idCreator } = require("../lib/function");
const Transactions = require("../models/Transactions");

router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transactions.find()
      .populate("party")
      .populate("referenceInvoice");

      res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create transaction

router.post("/", protect, async (req, res) => {
  try {

    const transaction_id = await idCreator({
      model: Transactions,
      idStr: "TID",
    });

    const transaction = new Transactions({
      ...req.body,
      createdBy: req.user.id,
      ID: transaction_id,
    });

    await transaction.save();

    const newTransaction = await Transactions.findById(transaction._id)
      .populate("party")
      .populate("referenceInvoice");

   res.status(201).json(newTransaction);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update transaction
router.put("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transactions.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    Object.assign(transaction, req.body);
    transaction.updatedAt = Date.now();

    await transaction.save();

    const updatedTransaction = await Transactions.findById(req.params.id)
      .populate("party")
      .populate("referenceInvoice");

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transactions.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "transaction not found" });
    }
    await transaction.deleteOne();
    res.json({ message: "transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
