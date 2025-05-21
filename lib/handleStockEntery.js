const PurchaseReceipt = require("../models/PurchaseReceipt");
const StockEntry = require("../models/StockEntry");
const StockLedger = require("../models/StockLedger");

const handleStockEntry = async ({ source, userId, type, direction }) => {
  if (!source || !Array.isArray(source.items) || source.items.length === 0) return;

  // --- Guard Clauses for Stock Conditions ---
  if (type === "Purchase") {
    if (source.status !== "Paid" || !source.stockEntered) return;
  }

  if (type === "PurchaseReturn") {
    if (source.status !== "Submitted") return;
  }

  // --- Validate Linked Warehouse from Receipt ---
  const receipt = await PurchaseReceipt.findById(source.purchaseReceipt);
  if (!receipt || !receipt.warehouse) {
    throw new Error("Missing or invalid purchase receipt or warehouse");
  }
  const warehouse = receipt.warehouse;

  // --- Process Each Item ---
  for (const item of source.items) {
    const { product, quantity, rate } = item;
    const total = quantity * rate;

    // --- Get previous balance from StockLedger ---
    const lastLedger = await StockLedger.findOne({ product, warehouse }).sort({ createdAt: -1 });
    
    const previousBalance = lastLedger?.balance || 0;

    // --- Prevent negative stock on OUT direction ---
    if (direction === "OUT" && quantity > previousBalance) {
      throw new Error(
        `Insufficient stock for product ${product}. Available: ${previousBalance}, Requested: ${quantity}`
      );
    }


    const newBalance = direction === "IN"
      ? previousBalance + quantity
      : previousBalance - quantity;

    // --- Create Stock Entry ---
    const stockEntry = await StockEntry.create({
      ID: `${type === "Purchase" ? "SE" : "RE"}-${Date.now().toString().slice(-6)}`, // Short ID
      product,
      warehouse,
      entryType: type === "PurchaseReturn" ? "Return" : "Purchase",
      quantity,
      rate,
      total,
      entryDate: new Date(),
      remarks: `Auto-created from ${type} ${source.ID}`,
      createdBy: userId,
    });

    // --- Create Stock Ledger Entry ---
    await StockLedger.create({
      product,
      warehouse,
      entryRefId: stockEntry._id,
      quantity,
      entryType: type === "Purchase" ? "Purchase" : "Return",
      direction,
      balance: newBalance,
      date: new Date(),
    });

   
  }

  // --- Update Source after Stock Entry ---
  if (type === "Purchase") {
    source.stockEntered = true;
    await source.save();
  }
};

module.exports = handleStockEntry;
