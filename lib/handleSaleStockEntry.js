const SaleInvoice = require("../models/SaleInvoice");
const StockEntry = require("../models/StockEntry");
const StockLedger = require("../models/StockLedger");

const handleSaleStockEntry = async ({ source, userId, type, direction }) => {
  if (!source || !Array.isArray(source.items) || source.items.length === 0)
    return;

  // --- Stock should be entered only when status and flags are valid ---
  if (type === "Invoice") {
    if (source.status !== "Paid" || !source.stockEntered) return;
  }

  if (type === "Return") {
    if (source.status !== "Accepted" || !source.stockEntered) return;
  }

  // // --- Get warehouse directly from the source --

  const receipt = await SaleInvoice.findById(source.saleInvoice);
  if (!receipt || !receipt.warehouse) {
    throw new Error("Missing or invalid purchase receipt or warehouse");
  }
  const warehouse = receipt.warehouse;

  // const warehouse = source.warehouse;
  // if (!warehouse) {
  //   throw new Error("Missing warehouse in the invoice");
  // }

  // --- Loop through each item and create stock entry and ledger ---
  for (const item of source.items) {
    const { product, quantity, rate } = item;
    const total = quantity * rate;

    const lastLedger = await StockLedger.findOne({ product, warehouse }).sort({
      createdAt: -1,
    });
    const previousBalance = lastLedger?.balance || 0;

    // --- Prevent stock going negative ---
    if (direction === "OUT" && quantity > previousBalance) {
      throw new Error(
        `Insufficient stock for product ${product}. Available: ${previousBalance}, Requested: ${quantity}`
      );
    }

    const newBalance =
      direction === "IN"
        ? previousBalance + quantity
        : previousBalance - quantity;

    // --- Create Stock Entry ---
    const stockEntry = await StockEntry.create({
      ID: `${type === "Invoice" ? "SL" : "RE"}-${Date.now()
        .toString()
        .slice(-6)}`,
      product,
      warehouse,
      entryType: type === "Return" ? "Return" : "Sale",
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
      entryType: type === "Invoice" ? "Sale" : "Return",
      direction,
      balance: newBalance,
      date: new Date(),
    });
  }

  // --- Update source to mark stock entry done ---
  source.stockEntered = true;
  await source.save();
};

module.exports = handleSaleStockEntry;
