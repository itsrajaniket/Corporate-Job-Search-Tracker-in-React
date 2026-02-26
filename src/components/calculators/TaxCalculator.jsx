// src/components/calculators/TaxCalculator.jsx
import React, { useState, useEffect } from "react";
import ToolCard from "./ToolCard";
import { calculate2026Details } from "./salaryUtils";

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const formatAndSetIncome = (val) => {
    let cleanVal = val.toString().replace(/\D/g, "");
    setIncome(cleanVal ? parseInt(cleanVal, 10).toLocaleString("en-IN") : "");
  };

  useEffect(() => {
    if (income) {
      setResult(calculate2026Details(income));
    } else {
      setResult(null);
    }
  }, [income]);

  return (
    <ToolCard
      title="Tax calculator"
      subtitle="CTC to In-Hand"
      icon="fas fa-wallet"
      iconClass="bg-indigo-600"
      cardStyle={{ background: "#faf5ff", borderColor: "#e9d5ff" }}
    >
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
            Annual CTC (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-stone-400 font-medium">
              ₹
            </span>
            <input
              type="text"
              value={income}
              onChange={(e) => formatAndSetIncome(e.target.value)}
              placeholder="e.g. 12,00,000"
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {result && (
          <div className="mt-auto p-4 bg-white border border-indigo-100 rounded-xl shadow-sm animate-row">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Monthly EPF:</span>
                <span className="font-bold text-stone-700">
                  ₹{Math.round(result.monthlyEPF).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Monthly Tax:</span>
                <span className="font-bold text-red-500">
                  ₹{Math.round(result.monthlyTax).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-px bg-indigo-50 my-1"></div>
              <div className="flex flex-col items-center pt-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                  Take Home Pay
                </span>
                <span className="text-2xl font-black text-emerald-600 leading-none">
                  ₹{Math.round(result.monthlyInHand).toLocaleString("en-IN")}
                  <span className="text-xs font-medium text-emerald-500 ml-1">
                    /mo
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
