import { Request, Response } from "express";
import { cloudDb, LicenseKey, LicenseTier, LicenseStatus } from "../models/store";

export const activateLicense = (req: Request, res: Response) => {
  const { key, machineId, deviceName } = req.body;

  if (!key || !machineId) {
    return res.status(400).json({
      success: false,
      message: "License key and machineId are required.",
    });
  }

  const license = cloudDb.findLicenseByKey(key);
  if (!license) {
    return res.status(404).json({
      success: false,
      message: "❌ Invalid license key. Please check your key or contact ZapyTeam.",
    });
  }

  if (license.status === "revoked") {
    return res.status(403).json({
      success: false,
      message: "⚠️ This license has been revoked. Please contact ZapyTeam support.",
    });
  }

  if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
    return res.status(403).json({
      success: false,
      message: "⏳ This license has expired. Please renew your plan.",
    });
  }

  // Check hardware binding
  const bound = license.boundDevices || [];
  if (!bound.includes(machineId)) {
    if (bound.length >= license.maxDevices) {
      return res.status(403).json({
        success: false,
        message: `🚫 Device limit reached (${bound.length}/${license.maxDevices} devices). Please deactivate from an existing PC or Android device first.`,
      });
    }
    bound.push(machineId);
    license.boundDevices = bound;
    cloudDb.saveLicense(license);
  }

  return res.json({
    success: true,
    message: `🎉 License activated successfully for ${license.customerName}!`,
    license: {
      id: license.id,
      key: license.key,
      customerName: license.customerName,
      tier: license.tier,
      expiresAt: license.expiresAt,
      maxDevices: license.maxDevices,
      aiCreditsPerMonth: license.aiCreditsPerMonth,
      aiCreditsUsed: license.aiCreditsUsed,
    },
  });
};

export const verifyLicense = (req: Request, res: Response) => {
  const { key, machineId } = req.body;

  if (!key) {
    return res.status(400).json({ valid: false, message: "Key required." });
  }

  const license = cloudDb.findLicenseByKey(key);
  if (!license || license.status !== "active") {
    return res.json({ valid: false, message: "License inactive or not found." });
  }

  if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
    return res.json({ valid: false, message: "License expired." });
  }

  if (machineId && !license.boundDevices.includes(machineId)) {
    return res.json({ valid: false, message: "Machine not bound to this license." });
  }

  return res.json({
    valid: true,
    tier: license.tier,
    customerName: license.customerName,
    aiCreditsRemaining: Math.max(0, license.aiCreditsPerMonth - license.aiCreditsUsed),
  });
};

export const createLicense = (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    tier = "pro",
    durationMonths = 12,
    maxDevices = 2,
    pricePaidBDT = 8500,
    notes = "",
  } = req.body;

  if (!customerName || !customerPhone) {
    return res.status(400).json({
      success: false,
      message: "Customer name and phone/WhatsApp number are required.",
    });
  }

  const randPart = () => Math.floor(1000 + Math.random() * 9000).toString();
  const key = `VIDFLOW-${(tier as string).toUpperCase()}-${randPart()}-${randPart()}-${randPart()}`;

  let expiresAt: string | null = null;
  if (Number(durationMonths) > 0) {
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + Number(durationMonths));
    expiresAt = expDate.toISOString();
  }

  const newLicense: LicenseKey = {
    id: "lic_" + Date.now(),
    key,
    customerName,
    customerPhone: customerPhone.replace(/[^0-9]/g, ""),
    customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, "")}@customer.com`,
    tier: tier as LicenseTier,
    status: "active",
    createdAt: new Date().toISOString(),
    expiresAt,
    maxDevices: Number(maxDevices),
    boundDevices: [],
    pricePaidBDT: Number(pricePaidBDT),
    aiCreditsPerMonth: tier === "agency" ? 2000 : tier === "pro" ? 500 : 100,
    aiCreditsUsed: 0,
    notes,
  };

  cloudDb.saveLicense(newLicense);

  return res.status(201).json({
    success: true,
    message: "License generated successfully.",
    license: newLicense,
  });
};

export const getAllLicenses = (_req: Request, res: Response) => {
  const licenses = cloudDb.getLicenses();
  const totalRevenueBDT = licenses.reduce((sum, l) => sum + (l.pricePaidBDT || 0), 0);
  const activeLicenses = licenses.filter((l) => l.status === "active").length;

  return res.json({
    licenses,
    stats: {
      totalRevenueBDT,
      activeLicenses,
      totalCustomers: licenses.length,
      totalRenders: 1248,
    },
  });
};

export const updateLicenseStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const license = cloudDb.getLicenses().find((l) => l.id === id);
  if (!license) {
    return res.status(404).json({ success: false, message: "License not found." });
  }

  license.status = status as LicenseStatus;
  cloudDb.saveLicense(license);

  return res.json({ success: true, message: `License status changed to ${status}.` });
};

export const deleteLicense = (req: Request, res: Response) => {
  const { id } = req.params;
  cloudDb.deleteLicense(id);
  return res.json({ success: true, message: "License deleted." });
};
