import React, { useState } from "react";

export default function CustomCompanyForm({ onAddCompany }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "Service-Based",
    policy: "Data Not Found",
    career: "",
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return alert("Please enter a company name.");

    let finalUrl = formData.career.trim();
    if (finalUrl && !finalUrl.startsWith("http"))
      finalUrl = "https://" + finalUrl;

    onAddCompany({
      ...formData,
      career:
        finalUrl ||
        `https://www.google.com/search?q=${encodeURIComponent(formData.name)}+careers`,
      buyout: "Unknown",
      isCustom: true,
      isImportant: false,
    });

    setFormData({
      name: "",
      industry: "Service-Based",
      policy: "Data Not Found",
      career: "",
    });
  };

  return (
    <div className="mb-5 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">
          <i className="fas fa-plus-circle text-amber-500"></i> Add Custom
          Company
        </div>
        <i
          className={`fas fa-chevron-down text-stone-300 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}
        ></i>
      </div>

      {isOpen && (
        <div className="flex flex-col md:flex-row gap-3 px-5 pb-4 pt-1 border-t border-stone-100">
          <input
            type="text"
            placeholder="Company Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 min-w-0 p-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
          <select
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            className="p-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <option value="Service-Based">Service-Based (IT)</option>
            <option value="Product-Based">Product-Based</option>
            <option value="Consulting">Consulting</option>
            <option value="Banking">Banking / FinTech</option>
            <option value="Engineering Services">Engineering Services</option>
            <option value="Conglomerate">Mfg / Other</option>
          </select>
          <select
            value={formData.policy}
            onChange={(e) =>
              setFormData({ ...formData, policy: e.target.value })
            }
            className="p-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <option value="Data Not Found">Notice: Unknown</option>
            <option value="90 Days">90 Days</option>
            <option value="60-90 Days">60-90 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="30-60 Days">30-60 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="15 Days">15 Days</option>
          </select>
          <input
            type="url"
            placeholder="Career URL (optional)"
            value={formData.career}
            onChange={(e) =>
              setFormData({ ...formData, career: e.target.value })
            }
            className="flex-1 min-w-0 p-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="btn-amber whitespace-nowrap"
          >
            Add Target
          </button>
        </div>
      )}
    </div>
  );
}
