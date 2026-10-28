import { Request, Response } from "express";
import { cloudDb, PaymentOrder, LicenseTier, LicenseKey } from "../models/store";

export const PRICING_PLANS = {
  starter: { name: "Starter Plan", priceBDT: 3500, durationMonths: 6, maxDevices: 1, credits: 100 },
  pro: { name: "Pro Solo Creator", priceBDT: 8500, durationMonths: 12, maxDevices: 2, credits: 500 },
  agency: { name: "Agency Unlimited", priceBDT: 25000, durationMonths: 12, maxDevices: 10, credits: 2000 },
  lifetime: { name: "Lifetime Dev Pass", priceBDT: 15000, durationMonths: 0, maxDevices: 5, credits: 1000 },
};

export const createCheckoutOrder = (req: Request, res: Response) => {
  const { customerName, customerPhone, customerEmail, tier = "pro", provider = "bkash" } = req.body;

  if (!customerName || !customerPhone) {
    return res.status(400).json({ success: false, message: "Customer name and phone required." });
  }

  const plan = PRICING_PLANS[tier as keyof typeof PRICING_PLANS] || PRICING_PLANS.pro;
  const orderNumber = "VF-" + Math.floor(100000 + Math.random() * 900000);

  const order: PaymentOrder = {
    id: "ord_" + Date.now(),
    orderNumber,
    customerName,
    customerPhone: customerPhone.replace(/[^0-9]/g, ""),
    customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, "")}@customer.com`,
    tier: tier as LicenseTier,
    amountBDT: plan.priceBDT,
    provider: provider as "bkash" | "nagad" | "sslcommerz" | "stripe",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  cloudDb.saveOrder(order);

  // Return payment instruction or checkout URL
  return res.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    amountBDT: order.amountBDT,
    provider: order.provider,
    instructions:
      provider === "bkash"
        ? `Send ${order.amountBDT} BDT to bKash Merchant/Personal (+8801911444546) with Reference: ${orderNumber}`
        : `Complete payment of ${order.amountBDT} BDT via ${provider.toUpperCase()}`,
  });
};

export const handlePaymentWebhook = (req: Request, res: Response) => {
  const { orderId, orderNumber, paymentStatus = "paid", transactionId } = req.body;

  const order = cloudDb.getOrders().find((o) => o.id === orderId || o.orderNumber === orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found." });
  }

  if (paymentStatus === "paid") {
    order.status = "paid";
    order.paidAt = new Date().toISOString();

    const plan = PRICING_PLANS[order.tier] || PRICING_PLANS.pro;
    const randPart = () => Math.floor(1000 + Math.random() * 9000).toString();
    const key = `VIDFLOW-${order.tier.toUpperCase()}-${randPart()}-${randPart()}-${randPart()}`;

    let expiresAt: string | null = null;
    if (plan.durationMonths > 0) {
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + plan.durationMonths);
      expiresAt = expDate.toISOString();
    }

    const newLicense: LicenseKey = {
      id: "lic_" + Date.now(),
      key,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      tier: order.tier,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt,
      maxDevices: plan.maxDevices,
      boundDevices: [],
      pricePaidBDT: order.amountBDT,
      aiCreditsPerMonth: plan.credits,
      aiCreditsUsed: 0,
      notes: `Automated ${order.provider.toUpperCase()} Checkout (Trx: ${transactionId || "MANUAL"})`,
    };

    cloudDb.saveLicense(newLicense);
    order.licenseKeyCreated = key;
    cloudDb.saveOrder(order);

    return res.json({
      success: true,
      message: "Payment confirmed and license generated!",
      licenseKey: key,
    });
  }

  order.status = "failed";
  cloudDb.saveOrder(order);
  return res.json({ success: false, message: "Order marked as failed." });
};
