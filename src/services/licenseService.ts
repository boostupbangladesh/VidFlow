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
  expiresAt: string | null; // null = lifetime
  maxDevices: number;
  boundDevices: string[];
  pricePaidBDT: number;
  notes?: string;
}

export interface SaaSStats {
  totalRevenueBDT: number;
  activeLicenses: number;
  totalCustomers: number;
  totalRenders: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  announcement: string;
  allowedModels: ("gemini-3.8-flash" | "argon-4" | "gemini-2.0-flash" | "claude-3-5-sonnet")[];
  enable4KExport: boolean;
  developerWhatsApp: string;
}

const STORAGE_KEYS = {
  LICENSES: "vidflow_saas_licenses_v1",
  CONFIG: "vidflow_saas_config_v1",
  CLIENT_ACTIVE_LICENSE: "vidflow_client_active_license_v1",
  MACHINE_ID: "vidflow_client_machine_id_v1",
};

// Default Initial SaaS Licenses for Demonstration
const INITIAL_LICENSES: LicenseKey[] = [
  {
    id: "lic_1",
    key: "VIDFLOW-PRO-8801-9114-4454",
    customerName: "Ashraf Hossain",
    customerPhone: "8801911444546",
    customerEmail: "ashraf@zapyteam.com",
    tier: "lifetime",
    status: "active",
    createdAt: "2026-10-01T10:00:00Z",
    expiresAt: null,
    maxDevices: 5,
    boundDevices: ["DEVICE-WIN-9821"],
    pricePaidBDT: 15000,
    notes: "Official ZapyTeam Dev License",
  },
  {
    id: "lic_2",
    key: "VIDFLOW-AGENCY-7712-4419-9021",
    customerName: "Creative Motion Agency",
    customerPhone: "8801712345678",
    customerEmail: "contact@creativeagency.bd",
    tier: "agency",
    status: "active",
    createdAt: "2026-10-15T12:00:00Z",
    expiresAt: "2027-10-15T12:00:00Z",
    maxDevices: 10,
    boundDevices: ["DEVICE-MAC-4102", "DEVICE-WIN-3321"],
    pricePaidBDT: 35000,
    notes: "Annual Agency Plan (Unlimited 4K)",
  },
  {
    id: "lic_3",
    key: "VIDFLOW-PRO-5541-2290-1184",
    customerName: "Tanvir Ahmed",
    customerPhone: "8801819876543",
    customerEmail: "tanvir.motion@gmail.com",
    tier: "pro",
    status: "active",
    createdAt: "2026-10-20T14:30:00Z",
    expiresAt: "2027-10-20T14:30:00Z",
    maxDevices: 2,
    boundDevices: ["DEVICE-WIN-7712"],
    pricePaidBDT: 8500,
    notes: "Solo Content Creator Plan",
  },
];

const INITIAL_CONFIG: SystemConfig = {
  maintenanceMode: false,
  announcement: "🚀 Welcome to VidFlow v1.0! Powered by Gemini 3.8 Flash & Argon 4.",
  allowedModels: ["gemini-3.8-flash", "argon-4"],
  enable4KExport: true,
  developerWhatsApp: "8801911444546",
};

class LicenseService {
  private getLicenses(): LicenseKey[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LICENSES);
    if (!raw) {
      this.saveLicenses(INITIAL_LICENSES);
      return INITIAL_LICENSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LICENSES;
    }
  }

  private saveLicenses(licenses: LicenseKey[]) {
    localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
  }

  public getConfig(): SystemConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      this.saveConfig(INITIAL_CONFIG);
      return INITIAL_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONFIG;
    }
  }

  public saveConfig(config: SystemConfig) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }

  // Get or generate a persistent local Machine ID for hardware binding
  public getMachineId(): string {
    let id = localStorage.getItem(STORAGE_KEYS.MACHINE_ID);
    if (!id) {
      id = "HWID-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
      localStorage.setItem(STORAGE_KEYS.MACHINE_ID, id);
    }
    return id;
  }

  // Generate a cryptographically styled License Key
  public createLicense(data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    tier: LicenseTier;
    durationMonths: number; // 0 = lifetime
    maxDevices: number;
    pricePaidBDT: number;
    notes?: string;
  }): LicenseKey {
    const licenses = this.getLicenses();
    const prefix = `VIDFLOW-${data.tier.toUpperCase()}`;
    const randPart = () => Math.floor(1000 + Math.random() * 9000).toString();
    const key = `${prefix}-${randPart()}-${randPart()}-${randPart()}`;

    let expiresAt: string | null = null;
    if (data.durationMonths > 0) {
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + data.durationMonths);
      expiresAt = expDate.toISOString();
    }

    const newLicense: LicenseKey = {
      id: "lic_" + Date.now(),
      key,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      tier: data.tier,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt,
      maxDevices: data.maxDevices,
      boundDevices: [],
      pricePaidBDT: data.pricePaidBDT,
      notes: data.notes,
    };

    licenses.unshift(newLicense);
    this.saveLicenses(licenses);
    return newLicense;
  }

  // Revoke or suspend a key
  public setLicenseStatus(id: string, status: LicenseStatus) {
    const licenses = this.getLicenses().map((l) =>
      l.id === id ? { ...l, status } : l
    );
    this.saveLicenses(licenses);
  }

  // Extend license expiry
  public extendLicense(id: string, additionalMonths: number) {
    const licenses = this.getLicenses().map((l) => {
      if (l.id === id) {
        const curExp = l.expiresAt ? new Date(l.expiresAt) : new Date();
        curExp.setMonth(curExp.getMonth() + additionalMonths);
        return { ...l, expiresAt: curExp.toISOString(), status: "active" as LicenseStatus };
      }
      return l;
    });
    this.saveLicenses(licenses);
  }

  // Delete license
  public deleteLicense(id: string) {
    const licenses = this.getLicenses().filter((l) => l.id !== id);
    this.saveLicenses(licenses);
  }

  public getAllLicenses(): LicenseKey[] {
    return this.getLicenses();
  }

  public getStats(): SaaSStats {
    const licenses = this.getLicenses();
    const totalRevenueBDT = licenses.reduce((sum, l) => sum + (l.pricePaidBDT || 0), 0);
    const activeLicenses = licenses.filter((l) => l.status === "active").length;
    return {
      totalRevenueBDT,
      activeLicenses,
      totalCustomers: licenses.length,
      totalRenders: 1248, // Aggregated counter
    };
  }

  // Get API Base URL (defaults to localhost:4000 in dev or VITE_API_BASE_URL)
  public getApiBaseUrl(): string {
    return (
      (import.meta as unknown as { env: { VITE_API_BASE_URL?: string } }).env
        ?.VITE_API_BASE_URL || "http://localhost:4000"
    );
  }

  // Client Validation: Verify license key against Cloud API Server & machine limits
  public async activateClientLicense(
    keyStr: string
  ): Promise<{ success: boolean; message: string; license?: LicenseKey }> {
    const trimmed = keyStr.trim().toUpperCase();
    const machineId = this.getMachineId();

    // 1. Try Cloud Server First
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/api/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: trimmed,
          machineId,
          deviceName: navigator.userAgent.includes("Android") ? "Android Device" : "Desktop PC",
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.license) {
        localStorage.setItem(
          STORAGE_KEYS.CLIENT_ACTIVE_LICENSE,
          JSON.stringify(data.license)
        );
        return {
          success: true,
          message: data.message || `🎉 License activated via Cloud! Plan: ${data.license.tier.toUpperCase()}`,
          license: data.license,
        };
      } else if (!response.ok) {
        return {
          success: false,
          message: data.message || "❌ License activation failed on server.",
        };
      }
    } catch (networkErr) {
      console.warn("Cloud server offline or unreachable, checking local database...", networkErr);
    }

    // 2. Offline / Local Fallback
    const licenses = this.getLicenses();
    const found = licenses.find((l) => l.key.toUpperCase() === trimmed);

    if (!found) {
      return {
        success: false,
        message: "❌ Invalid license key! Please ensure your internet connection is active or enter a valid key.",
      };
    }

    if (found.status === "revoked") {
      return { success: false, message: "⚠️ This license has been revoked. Please contact ZapyTeam support." };
    }

    if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
      return { success: false, message: "⏳ This license has expired. Please contact ZapyTeam to renew." };
    }

    if (!found.boundDevices.includes(machineId)) {
      if (found.boundDevices.length >= found.maxDevices) {
        return {
          success: false,
          message: `🚫 Device limit (${found.maxDevices} devices) reached for this key. Please deactivate from an existing device.`,
        };
      }
      found.boundDevices.push(machineId);
      this.saveLicenses(licenses);
    }

    // Save as client active license locally
    localStorage.setItem(STORAGE_KEYS.CLIENT_ACTIVE_LICENSE, JSON.stringify(found));
    return {
      success: true,
      message: `🎉 License activated successfully (Offline Cache)! Plan: ${found.tier.toUpperCase()}`,
      license: found,
    };
  }

  public getActiveClientLicense(): LicenseKey | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_ACTIVE_LICENSE);
    if (!raw) {
      // Default to the first pre-seeded pro license for dev/testing so app is usable out of the box
      const defaultLic = INITIAL_LICENSES[0];
      localStorage.setItem(STORAGE_KEYS.CLIENT_ACTIVE_LICENSE, JSON.stringify(defaultLic));
      return defaultLic;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public deactivateClientLicense() {
    localStorage.removeItem(STORAGE_KEYS.CLIENT_ACTIVE_LICENSE);
  }
}

export const licenseService = new LicenseService();
