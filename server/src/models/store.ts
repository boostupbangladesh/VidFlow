import fs from "fs";
import path from "path";

export type LicenseTier = "starter" | "pro" | "agency" | "lifetime";
export type LicenseStatus = "active" | "expired" | "revoked";

export interface LicenseKey {
  id: string;
  key: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tier: LicenseTier;
  status: LicenseStatus;
  createdAt: string;
  expiresAt: string | null;
  maxDevices: number;
  boundDevices: string[];
  pricePaidBDT: number;
  aiCreditsPerMonth: number;
  aiCreditsUsed: number;
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  licenseKey?: string;
  createdAt: string;
}

export interface PaymentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tier: LicenseTier;
  amountBDT: number;
  provider: "bkash" | "nagad" | "sslcommerz" | "stripe";
  status: "pending" | "paid" | "failed";
  licenseKeyCreated?: string;
  createdAt: string;
  paidAt?: string;
}

interface DatabaseSchema {
  users: UserAccount[];
  licenses: LicenseKey[];
  orders: PaymentOrder[];
  systemConfig: {
    maintenanceMode: boolean;
    announcement: string;
    serverVersion: string;
  };
}

const DB_PATH = path.join(process.cwd(), "data", "vidflow_db.json");

// Initial Seed Data
const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: "usr_admin_1",
      name: "ZapyTeam Admin",
      email: "admin@vidflow.io",
      // Default bcrypt/sha256 hash or secure pin
      passwordHash: "vidflow@2026",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ],
  licenses: [
    {
      id: "lic_official_1",
      key: "VIDFLOW-PRO-8801-9114-4454",
      customerName: "Ashraf Hossain",
      customerPhone: "8801911444546",
      customerEmail: "ashraf@zapyteam.com",
      tier: "lifetime",
      status: "active",
      createdAt: "2026-10-01T10:00:00Z",
      expiresAt: null,
      maxDevices: 5,
      boundDevices: [],
      pricePaidBDT: 15000,
      aiCreditsPerMonth: 1000,
      aiCreditsUsed: 0,
      notes: "Official ZapyTeam Dev License",
    },
  ],
  orders: [],
  systemConfig: {
    maintenanceMode: false,
    announcement: "🚀 VidFlow Cloud v1.0 is Live with Desktop & Android Sync!",
    serverVersion: "1.0.0",
  },
};

class CloudDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("DB load error, initializing default", e);
    }
    this.save(DEFAULT_DB);
    return DEFAULT_DB;
  }

  private save(data: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("DB save error", e);
    }
  }

  public getLicenses(): LicenseKey[] {
    return this.data.licenses;
  }

  public findLicenseByKey(keyStr: string): LicenseKey | undefined {
    const clean = keyStr.trim().toUpperCase();
    return this.data.licenses.find((l) => l.key.toUpperCase() === clean);
  }

  public saveLicense(license: LicenseKey) {
    const idx = this.data.licenses.findIndex((l) => l.id === license.id);
    if (idx >= 0) {
      this.data.licenses[idx] = license;
    } else {
      this.data.licenses.unshift(license);
    }
    this.save(this.data);
  }

  public deleteLicense(id: string) {
    this.data.licenses = this.data.licenses.filter((l) => l.id !== id);
    this.save(this.data);
  }

  public getUsers(): UserAccount[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): UserAccount | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public saveUser(user: UserAccount) {
    const idx = this.data.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.data.users[idx] = user;
    } else {
      this.data.users.push(user);
    }
    this.save(this.data);
  }

  public getOrders(): PaymentOrder[] {
    return this.data.orders;
  }

  public saveOrder(order: PaymentOrder) {
    const idx = this.data.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = order;
    } else {
      this.data.orders.unshift(order);
    }
    this.save(this.data);
  }

  public getConfig() {
    return this.data.systemConfig;
  }
}

export const cloudDb = new CloudDatabase();
