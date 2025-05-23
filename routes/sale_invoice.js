const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { idCreator } = require("../lib/function");
const SaleInvoice = require("../models/SaleInvoice");
const handleSaleStockEntry = require("../lib/handleSaleStockEntry");

router.get("/", protect, async (req, res) => {
  try {
    const sale_invoices = await SaleInvoice.find()
      .populate({ path: "saleOrder", select: "_id items ID totalAmount" })
      .populate({ path: "customer", select: "_id name ID" })
      .populate({
        path: "warehouse",
        select: "_id name location",
      })
      .populate("createdBy");

    res.json(sale_invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new invoice

router.post("/", protect, async (req, res) => {
  try {
    const invoice_id = await idCreator({
      model: SaleInvoice,
      idStr: "SINVOICE",
    });

    const invoice = new SaleInvoice({
      ...req.body,
      createdBy: req.user.id,
      ID: invoice_id,
    });

 
    const stock_entry = await handleSaleStockEntry({
      source: invoice,
      userId: req.user.id,
      type: "Invoice",
      direction: "OUT",
    });

     if (stock_entry) {
      await invoice.save();
    }

    const newInvoice = await SaleInvoice.findById(invoice._id)
      .populate({ path: "saleOrder", select: "_id items ID totalAmount" })
      .populate({ path: "customer", select: "_id name ID" })
      .populate({
        path: "warehouse",
        select: "_id name location",
      })
      .populate("createdBy");

    res.status(201).json(newInvoice);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put("/:id", protect, async (req, res) => {
  try {
    const invoice = await SaleInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    Object.assign(invoice, req.body);
    invoice.updatedAt = Date.now();
    // await invoice.save();

    const stock_entry = await handleSaleStockEntry({
      source: invoice,
      userId: req.user.id,
      type: "Invoice",
      direction: "OUT",
    });


    if(stock_entry){
      await invoice.save();
    }

    const updatedInvoice = await SaleInvoice.findById(req.params.id)
      .populate({ path: "saleOrder", select: "_id items ID totalAmount" })
      .populate({ path: "customer", select: "_id name ID" })
      .populate({
        path: "warehouse",
        select: "_id name location",
      })
      .populate("createdBy");

    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Invoice
router.delete("/:id", protect, async (req, res) => {
  try {
    const invoice = await SaleInvoice.findById(req.params.id);
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
