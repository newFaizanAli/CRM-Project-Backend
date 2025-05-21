const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const PurchaseInvoices = require("../models/PurchaseInvoice");
const { idCreator } = require("../lib/function");
const handleStockEntry = require("../lib/handleStockEntery");

router.get("/", protect, async (req, res) => {
  try {
    const purchase_invoices = await PurchaseInvoices.find()
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      });

    res.json(purchase_invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create purchase invoice

router.post("/", protect, async (req, res) => {
  try {
    const invoice_id = await idCreator({
      model: PurchaseInvoices,
      idStr: "PINVOICE",
    });

    const invoice = new PurchaseInvoices({
      ...req.body,
      createdBy: req.user.id,
      ID: invoice_id,
    });

    const stock_entry = await handleStockEntry({
      source: invoice,
      userId: req.user.id,
      type: "Purchase",
      direction: "IN",
    });

    if (stock_entry) {
      await invoice.save();
    }

    const newInvoice = await PurchaseInvoices.findById(invoice._id)
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put("/:id", protect, async (req, res) => {
  try {
    const invoice = await PurchaseInvoices.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.stockEntered) {
      return res
        .status(403)
        .json({ message: "Invoice already used for stock. Cannot update." });
    }

    Object.assign(invoice, req.body);
    invoice.updatedAt = Date.now();

    

    const stock_entry = await handleStockEntry({
      source: invoice,
      userId: req.user.id,
      type: "Purchase",
      direction: "IN",
    });

    if (stock_entry) {
      await invoice.save();
    }

    const updatedInvoice = await PurchaseInvoices.findById(req.params.id)
      .populate({ path: "purchaseReceipt", select: "_id items ID totalAmount" })
      .populate("createdBy")
      .populate({
        path: "supplier",
        select: "_id name",
      });

    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete("/:id", protect, async (req, res) => {
  try {
    const invoice = await PurchaseInvoices.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    }
    await invoice.deleteOne();
    res.json({ message: "invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
