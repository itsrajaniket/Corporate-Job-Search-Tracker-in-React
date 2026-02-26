// src/components/calculators/SalaryCalculator.jsx
import React, { useState, useEffect } from "react";
import ToolCard from "./ToolCard";
import { calculate2026Details } from "./salaryUtils";

export default function SalaryCalculator() {
  const [ctcInput, setCtcInput] = useState("");
  const [monthlyInHand, setMonthlyInHand] = useState(null);

  const formatAndSetCTC = (val) => {
    let cleanVal = val.toString().replace(/\D/g, "");
    if (!cleanVal) {
      setCtcInput("");
      return;
    }
    setCtcInput(parseInt(cleanVal, 10).toLocaleString("en-IN"));
  };

  const adjustCTC = (amount) => {
    let currentVal = parseInt(ctcInput.replace(/\D/g, "")) || 0;
    let newVal = Math.max(0, currentVal + amount);
    formatAndSetCTC(newVal);
  };

  // Auto-calculates instantly when user types or clicks +/-
  useEffect(() => {
    if (ctcInput) {
      const details = calculate2026Details(ctcInput);
      setMonthlyInHand(details ? details.monthlyInHand : null);
    } else {
      setMonthlyInHand(null);
    }
  }, [ctcInput]);

  return (
    <ToolCard
      title="In-Hand Calculator"
      subtitle="Estimate monthly take-home"
      icon="fas fa-rupee-sign"
      iconClass="bg-emerald-600"
      cardStyle={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
    >
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Annual CTC (₹)
          </label>
          <div className="relative flex items-center">
            <button
              onClick={() => adjustCTC(-100000)}
              className="absolute left-0 w-10 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-l-xl transition-colors cursor-pointer"
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            <input
              type="text"
              value={ctcInput}
              onChange={(e) => formatAndSetCTC(e.target.value)}
              placeholder="e.g. 8,00,000"
              className="w-full text-center px-10 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800"
            />
            <button
              onClick={() => adjustCTC(100000)}
              className="absolute right-0 w-10 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-r-xl transition-colors cursor-pointer"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
        </div>

        {monthlyInHand !== null && (
          <div className="mt-auto bg-white rounded-xl p-4 text-center border border-emerald-100 shadow-sm animate-row">
            <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mb-1">
              Est. Monthly In-Hand
            </div>
            <div className="text-3xl font-display font-bold text-emerald-600">
              ₹ {Math.round(monthlyInHand).toLocaleString("en-IN")}
            </div>
            <div className="mt-1 text-[9px] text-stone-500 leading-tight">
              *Approximate via New Tax Regime.
              <br />
              Accounts for std. deduction & EPF.
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
