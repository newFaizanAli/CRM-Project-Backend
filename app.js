const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware

// vercel
const VERCEL_VITE = "https://crm-project-frontend-one.vercel.app";
const VITE_URL = "http://localhost:5173";

// CORS middleware FIRST
app.use(
  cors({
    origin: [VERCEL_VITE, VITE_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));

// CRM
app.use("/api/leads", require("./routes/leads"));
app.use("/api/deals", require("./routes/deals"));

app.use("/api/activities", require("./routes/activities"));

// stock
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/warehouses", require("./routes/warehouses"));
app.use("/api/stock-entry", require("./routes/stockentry"));
app.use("/api/stock-ledger", require("./routes/stockledger"));

// buying
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/purchase-orders", require("./routes/purchase_orders"));
app.use("/api/purchase-receipts", require("./routes/purchase_receipt"));
app.use("/api/purchase-invoices", require("./routes/purchase_invoice"));
app.use("/api/purchase-returns", require("./routes/purchase_return"));

// sales
app.use("/api/customers", require("./routes/customers"));
app.use("/api/sale-orders", require("./routes/sale_order"));
app.use("/api/sale-invoices", require("./routes/sale_invoice"));
app.use("/api/sale-returns", require("./routes/sale_return"));

// transactions

app.use("/api/transactions", require("./routes/transactions"));

// hr

app.use("/api/departments", require("./routes/departments"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/companies", require("./routes/companies"));
app.use("/api/contacts", require("./routes/contacts"));

app.use("/api/attendances", require("./routes/hr/attendance"));
app.use("/api/leaves", require("./routes/hr/leaves"));

// project

app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

// payroll

app.use("/api/salary-components", require("./routes/payroll/salary_component"));
app.use("/api/salary-structures", require("./routes/payroll/salary_structure"));
app.use("/api/salary-slips", require("./routes/payroll/salary_slip"));


// asset

app.use("/api/asset-categories", require("./routes/asset/asset_category"));
app.use("/api/asset-locations", require("./routes/asset/asset_location"));
app.use("/api/assets", require("./routes/asset/asset"));

app.use("/api/maintainance_teams", require("./routes/asset/maintainance/maintainance_team"));
app.use("/api/maintainance_requests", require("./routes/asset/maintainance/maintainance_request"));
app.use("/api/maintenance_logs", require("./routes/asset/maintainance/maintainance_log"));

// workstation

app.use("/api/workstation-types", require("./routes/manufacturing/workstation_type"));
app.use("/api/workstations", require("./routes/manufacturing/workstations"));
app.use("/api/operations", require("./routes/manufacturing/operations"));
// app.use("/api/manufacturing_items", require("./routes/manufacturing/manufacturing_items"));
app.use("/api/bom", require("./routes/manufacturing/bom"));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
