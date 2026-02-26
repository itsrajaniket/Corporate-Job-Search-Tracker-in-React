import React, { useState } from "react";
import ToolCard from "./ToolCard";

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
    let newVal = currentVal + amount;
    if (newVal < 0) newVal = 0;
    formatAndSetCTC(newVal);
    // Note: To auto-calculate here like your HTML did, we use a useEffect or just let the user hit calculate.
  };

  const calculateInHand = () => {
    const ctc = parseFloat(ctcInput.replace(/\D/g, ""));
    if (!ctc || isNaN(ctc)) {
      setMonthlyInHand(null);
      return;
    }

    const basic = ctc * 0.5;
    const gratuity = basic * 0.0481;
    const pfEmployer = Math.min(basic * 0.12, 21600);
    const pfEmployee = pfEmployer;
    const fixedGross = ctc - pfEmployer - gratuity;

    let taxableIncome = Math.max(0, fixedGross - 75000);
    let tax = 0;

    if (taxableIncome > 700000) {
      if (taxableIncome > 300000)
        tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
      if (taxableIncome > 700000)
        tax += Math.min(taxableIncome - 700000, 300000) * 0.1;
      if (taxableIncome > 1000000)
        tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
      if (taxableIncome > 1200000)
        tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
      if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;
    }

    tax = tax * 1.04;
    const annualInHand = fixedGross - pfEmployee - tax;
    setMonthlyInHand(annualInHand / 12);
  };

  return (
    <ToolCard
      title="In-Hand Calculator"
      subtitle="Estimate monthly take-home"
      icon="fas fa-rupee-sign"
      iconClass="bg-emerald-600"
      cardStyle={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
              className="w-full text-center px-10 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800"
            />
            <button
              onClick={() => adjustCTC(100000)}
              className="absolute right-0 w-10 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-r-xl transition-colors cursor-pointer"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
        </div>
        <button
          onClick={calculateInHand}
          className="w-full py-3 text-white font-semibold rounded-xl cursor-pointer hover:bg-emerald-700 transition-colors bg-emerald-600"
        >
          Calculate Salary
        </button>
      </div>

      {monthlyInHand !== null && (
        <div className="mt-5 bg-white rounded-xl p-5 text-center border border-emerald-100 animate-row">
          <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">
            Est. Monthly In-Hand
          </div>
          <div className="text-3xl font-display font-bold text-emerald-600">
            ₹ {Math.round(monthlyInHand).toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-[10px] text-stone-500 leading-tight">
            *Approximate via New Tax Regime.
            <br />
            Accounts for std. deduction & standard EPF.
          </div>
        </div>
      )}
    </ToolCard>
  );
}
