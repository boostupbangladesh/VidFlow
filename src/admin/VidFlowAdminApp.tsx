import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Users,
  Settings,
  Plus,
  Copy,
  Check,
  MessageCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  licenseService,
  LicenseKey,
  LicenseTier,
  LicenseStatus,
  SystemConfig,
} from "../services/licenseService";

interface VidFlowAdminAppProps {
  onBackToStudio: () => void;
}

export const VidFlowAdminApp: React.FC<VidFlowAdminAppProps> = ({ onBackToStudio }) => {
  const [activeTab, setActiveTab] = useState<"licenses" | "analytics" | "customers" | "settings">("licenses");
  const [licenses, setLicenses] = useState<LicenseKey[]>(licenseService.getAllLicenses());
  const [config, setConfig] = useState<SystemConfig>(licenseService.getConfig());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LicenseStatus>("all");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // New License Modal state
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTier, setNewTier] = useState<LicenseTier>("pro");
  const [newMonths, setNewMonths] = useState<number>(12);
  const [newDevices, setNewDevices] = useState<number>(2);
  const [newPriceBDT, setNewPriceBDT] = useState<number>(8500);
  const [newNotes, setNewNotes] = useState("");

  const refreshData = () => {
    setLicenses(licenseService.getAllLicenses());
    setConfig(licenseService.getConfig());
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      alert("Please enter customer name and WhatsApp number.");
      return;
    }

    licenseService.createLicense({
      customerName: newName,
      customerPhone: newPhone.replace(/[^0-9]/g, ""),
      customerEmail: newEmail || `${newName.toLowerCase().replace(/\s+/g, "")}@customer.com`,
      tier: newTier,
      durationMonths: Number(newMonths),
      maxDevices: Number(newDevices),
      pricePaidBDT: Number(newPriceBDT),
      notes: newNotes,
    });

    setIsNewKeyModalOpen(false);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewNotes("");
    refreshData();
  };

  const handleStatusToggle = (id: string, current: LicenseStatus) => {
    const next: LicenseStatus = current === "active" ? "revoked" : "active";
    licenseService.setLicenseStatus(id, next);
    refreshData();
  };

  const handleExtend = (id: string) => {
    licenseService.extendLicense(id, 6);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this license?")) {
      licenseService.deleteLicense(id);
      refreshData();
    }
  };

  const handleSaveConfig = () => {
    licenseService.saveConfig(config);
    alert("✅ System settings updated successfully!");
  };

  const stats = licenseService.getStats();

  const filteredLicenses = licenses.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.customerPhone.includes(searchQuery) ||
      l.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0c0f18]/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Video Studio</span>
          </button>
          <div className="h-6 w-[1px] bg-white/[0.1]" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-extrabold text-base text-white tracking-tight">
                  VidFlow <span className="text-purple-400">SaaS Commander</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Developed by <strong className="text-slate-200">ZapyTeam</strong> (WhatsApp: +8801911444546)
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab("licenses")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "licenses"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key size={14} />
            <span>Licenses ({licenses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp size={14} />
            <span>Analytics & Revenue</span>
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "customers"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users size={14} />
            <span>Customers</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings size={14} />
            <span>Global Settings</span>
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsNewKeyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Issue New License Key</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0f121d] border border-white/[0.08] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total SaaS Revenue</span>
              <h3 className="text-2xl font-black font-outfit text-white mt-1">
                ৳ {stats.totalRevenueBDT.toLocaleString()}
              </h3>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp size={11} /> +100% Direct BDT Inflow
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f121d] border border-white/[0.08] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Active Paid Licenses</span>
              <h3 className="text-2xl font-black font-outfit text-white mt-1">
                {stats.activeLicenses} / {licenses.length}
              </h3>
              <span className="text-[11px] text-cyan-400 flex items-center gap-1 mt-1">
                <CheckCircle2 size={11} /> Healthy Subscription Base
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Key size={24} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f121d] border border-white/[0.08] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Subscribers</span>
              <h3 className="text-2xl font-black font-outfit text-white mt-1">
                {stats.totalCustomers}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1">With Verified WhatsApp</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users size={24} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f121d] border border-white/[0.08] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Videos Rendered</span>
              <h3 className="text-2xl font-black font-outfit text-white mt-1">
                {stats.totalRenders}
              </h3>
              <span className="text-[11px] text-purple-300 mt-1">Zero Cloud Render Cost</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* TAB 1: LICENSES MANAGER */}
        {activeTab === "licenses" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-[#0f121d] border border-white/[0.08] px-3 py-2 rounded-xl">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or license key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-slate-500 outline-none w-full font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                {(["all", "active", "expired", "revoked"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === s
                        ? "bg-purple-600 text-white"
                        : "bg-[#0f121d] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* License Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18] overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121624] text-slate-400 border-b border-white/[0.08] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">License Key</th>
                    <th className="py-3.5 px-4">Plan Tier</th>
                    <th className="py-3.5 px-4">Price (BDT)</th>
                    <th className="py-3.5 px-4">Devices Bound</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredLicenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{lic.customerName}</div>
                        <a
                          href={`https://wa.me/${lic.customerPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] mt-0.5"
                        >
                          <MessageCircle size={11} /> {lic.customerPhone}
                        </a>
                      </td>
                      <td className="py-3 px-4 font-mono-time">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 px-2 py-1 rounded text-purple-300 font-semibold border border-purple-500/20">
                            {lic.key}
                          </span>
                          <button
                            onClick={() => handleCopyKey(lic.key, lic.id)}
                            className="p-1 hover:bg-white/[0.1] rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy License Key"
                          >
                            {copiedKeyId === lic.id ? (
                              <Check size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            lic.tier === "lifetime"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                              : lic.tier === "agency"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          }`}
                        >
                          {lic.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        ৳ {lic.pricePaidBDT?.toLocaleString() || 0}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-semibold text-white">
                          {lic.boundDevices.length}
                        </span>{" "}
                        / {lic.maxDevices} Devices
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            lic.status === "active"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          {lic.status === "active" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <XCircle size={10} />
                          )}
                          <span className="capitalize">{lic.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {lic.expiresAt ? (
                          <div className="flex items-center gap-1">
                            <Clock size={11} />
                            <span>{new Date(lic.expiresAt).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-purple-400 font-semibold">Lifetime Access</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusToggle(lic.id, lic.status)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                              lic.status === "active"
                                ? "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                                : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                            }`}
                          >
                            {lic.status === "active" ? "Revoke" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleExtend(lic.id)}
                            className="p-1 hover:bg-white/[0.08] text-slate-400 hover:text-white rounded"
                            title="Extend Validity +6 Months"
                          >
                            <RefreshCw size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(lic.id)}
                            className="p-1 hover:bg-rose-500/20 text-rose-400 rounded"
                            title="Delete License"
                          >
                            <XCircle size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS & REVENUE */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-4">
              <h3 className="font-outfit font-bold text-lg text-white">SaaS Revenue by Plan</h3>
              <div className="space-y-3">
                {[
                  { name: "Lifetime Plan", price: "৳ 15,000", count: 1, share: "26%" },
                  { name: "Agency Enterprise", price: "৳ 35,000", count: 1, share: "60%" },
                  { name: "Creator Pro", price: "৳ 8,500", count: 1, share: "14%" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#121624] border border-white/[0.05]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-emerald-400 font-semibold">{item.price}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                        style={{ width: item.share }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-4">
              <h3 className="font-outfit font-bold text-lg text-white">Commercial SaaS USP</h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-bold text-purple-300 mb-1">
                    🎯 Zero Token Re-editing = 90% Higher Customer Retention
                  </h4>
                  <p className="text-slate-400">
                    VidFlow subscribers can edit text, audio, and keyframes locally for free after generation, avoiding costly recurring AI API bills and boosting lifetime retention.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <h4 className="font-bold text-cyan-300 mb-1">
                    🛡️ HWID Machine Lock Protection
                  </h4>
                  <p className="text-slate-400">
                    Each license key is bound to hardware machine IDs up to the allowed device limit, preventing unauthorized credential sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS & WHATSAPP SUPPORT */}
        {activeTab === "customers" && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-outfit font-bold text-lg text-white">Registered Customer Directory</h3>
                <p className="text-xs text-slate-400">
                  Direct communication, support, and renewal conversations with subscribers via WhatsApp
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {licenses.map((lic) => (
                <div
                  key={lic.id}
                  className="p-4 rounded-xl bg-[#121624] border border-white/[0.06] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{lic.customerName}</h4>
                      <span className="text-[11px] text-slate-400">{lic.customerEmail}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                      {lic.tier}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div>
                      License: <span className="font-mono text-purple-300">{lic.key}</span>
                    </div>
                    <div>
                      Paid: <span className="text-emerald-400 font-bold">BDT {lic.pricePaidBDT}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${lic.customerPhone}?text=Hello%20${encodeURIComponent(
                      lic.customerName
                    )},%20thank%20you%20for%20using%20VidFlow!%20ZapyTeam%20Support`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM CONTROLS & FEATURE FLAGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0c0f18] p-6 space-y-6">
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">Global Software Configuration</h3>
              <p className="text-xs text-slate-400">
                Configure global AI model access and system feature flags in real-time
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Broadcast Announcement */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">System Announcement Banner</label>
                <input
                  type="text"
                  value={config.announcement}
                  onChange={(e) => setConfig({ ...config, announcement: e.target.value })}
                  className="w-full bg-[#121624] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#121624] border border-white/[0.05] cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Enable Gemini 3.8 Flash (Latest AI)</div>
                    <div className="text-slate-400 text-[11px]">Allow clients to use Google Gemini 3.8 Flash</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowedModels.includes("gemini-3.8-flash")}
                    onChange={(e) => {
                      const models = e.target.checked
                        ? [...config.allowedModels, "gemini-3.8-flash" as const]
                        : config.allowedModels.filter((m) => m !== "gemini-3.8-flash");
                      setConfig({ ...config, allowedModels: models });
                    }}
                    className="accent-purple-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#121624] border border-white/[0.05] cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Enable Argon 4 (Gemini Cinematic Engine)</div>
                    <div className="text-slate-400 text-[11px]">Allow clients to use Gemini Argon 4 cinematic motion engine</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowedModels.includes("argon-4")}
                    onChange={(e) => {
                      const models = e.target.checked
                        ? [...config.allowedModels, "argon-4" as const]
                        : config.allowedModels.filter((m) => m !== "argon-4");
                      setConfig({ ...config, allowedModels: models });
                    }}
                    className="accent-purple-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#121624] border border-white/[0.05] cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Enable 4K Ultra-HD Export</div>
                    <div className="text-slate-400 text-[11px]">High-resolution frame-by-frame export</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enable4KExport}
                    onChange={(e) => setConfig({ ...config, enable4KExport: e.target.checked })}
                    className="accent-purple-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#121624] border border-white/[0.05] cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Maintenance Mode</div>
                    <div className="text-slate-400 text-[11px]">Lock client studio for maintenance</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                    className="accent-rose-600 w-4 h-4"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all mt-4"
              >
                Save Global Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW LICENSE MODAL */}
      {isNewKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-outfit font-bold text-lg text-white">Issue New SaaS License</h3>
                <p className="text-xs text-slate-400">Create and issue a commercial license key for a customer</p>
              </div>
              <button
                onClick={() => setIsNewKeyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rafiqul Islam"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="88017XXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price Paid (BDT)</label>
                  <input
                    type="number"
                    value={newPriceBDT}
                    onChange={(e) => setNewPriceBDT(Number(e.target.value))}
                    className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plan Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as LicenseTier)}
                    className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  >
                    <option value="starter">Starter Plan</option>
                    <option value="pro">Creator Pro</option>
                    <option value="agency">Agency Enterprise</option>
                    <option value="lifetime">Lifetime Deal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Validity (Months)</label>
                  <select
                    value={newMonths}
                    onChange={(e) => setNewMonths(Number(e.target.value))}
                    className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year (12 Months)</option>
                    <option value="0">Lifetime (No Expiry)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Allowed Devices (HWID)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newDevices}
                  onChange={(e) => setNewDevices(Number(e.target.value))}
                  className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Invoice Ref</label>
                <input
                  type="text"
                  placeholder="e.g. Bkash Trx ID #78912..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewKeyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold shadow-lg"
                >
                  Generate & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
