import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  activateLicense,
  verifyLicense,
  createLicense,
  getAllLicenses,
  updateLicenseStatus,
  deleteLicense,
} from "./controllers/licenseController";
import { generateAIProject } from "./controllers/aiController";
import { createCheckoutOrder, handlePaymentWebhook } from "./controllers/paymentController";
import { cloudDb } from "./models/store";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "VidFlow Cloud Server",
    version: "1.0.0",
    platform: "Desktop & Android Sync API",
    time: new Date().toISOString(),
  });
});

// Licensing & Hardware Lock APIs
app.post("/api/license/activate", activateLicense);
app.post("/api/license/verify", verifyLicense);
app.post("/api/license/create", createLicense);
app.get("/api/license/all", getAllLicenses);
app.patch("/api/license/:id/status", updateLicenseStatus);
app.delete("/api/license/:id", deleteLicense);

// Secure AI Generation Proxy
app.post("/api/ai/generate", generateAIProject);

// Payment & Checkout APIs
app.post("/api/payment/checkout", createCheckoutOrder);
app.post("/api/payment/webhook", handlePaymentWebhook);

// System Config
app.get("/api/config", (_req, res) => {
  res.json(cloudDb.getConfig());
});

app.listen(PORT, () => {
  console.log(`🚀 VidFlow Cloud Backend running on http://localhost:${PORT}`);
});
