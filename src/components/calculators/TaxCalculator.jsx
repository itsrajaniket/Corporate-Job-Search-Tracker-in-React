import React, { useState } from "react";

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const calculateInHand = () => {
    const ctc = parseFloat(ctcInput.replace(/\D/g, ""));
    if (!ctc || isNaN(ctc)) {
      setMonthlyInHand(null);
      return;
    }

    const basic = ctc * 0.5; // Standard 50% basic
    const gratuity = basic * 0.0481; // 4.81% gratuity component
    const pfEmployer = Math.min(basic * 0.12, 21600); // PF capped at 1800/mo
    const pfEmployee = pfEmployer;

    // Gross salary before tax and employee PF
    const fixedGross = ctc - pfEmployer - gratuity;

    // 2026 Standard Deduction is ₹75,000
    let taxableIncome = Math.max(0, fixedGross - 75000);
    let tax = 0;

    // REVISED 2026 SLABS: Taxable income up to 12L is tax-free
    if (taxableIncome > 1200000) {
      // Slab-wise calculation for income above the 12L threshold
      if (taxableIncome > 400000)
        tax += Math.min(400000, taxableIncome - 400000) * 0.05;
      if (taxableIncome > 800000)
        tax += Math.min(400000, taxableIncome - 800000) * 0.1;
      if (taxableIncome > 1200000)
        tax += Math.min(400000, taxableIncome - 1200000) * 0.15;
      if (taxableIncome > 1600000)
        tax += Math.min(400000, taxableIncome - 1600000) * 0.2;
      if (taxableIncome > 2000000)
        tax += Math.min(400000, taxableIncome - 2000000) * 0.25;
      if (taxableIncome > 2400000) tax += (taxableIncome - 2400000) * 0.3;

      // Add 4% Health & Education Cess
      tax = tax * 1.04;
    } else {
      // Tax is zero if taxable income is <= 12L
      tax = 0;
    }

    const annualInHand = fixedGross - pfEmployee - tax;
    setMonthlyInHand(annualInHand / 12);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col relative overflow-hidden group h-full">
      {/* Background Icon */}
      <i className="fas fa-coins absolute -bottom-4 -right-4 text-7xl text-stone-50 opacity-50 group-hover:rotate-12 transition-transform duration-500"></i>

      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
          <i className="fas fa-wallet text-lg"></i>
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-slate-900 leading-tight">
            Salary Breakup
          </h3>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">
            CTC to In-Hand
          </p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-grow">
        <div>
          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
            Annual CTC (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-stone-400 font-medium">
              ₹
            </span>
            <input
              type="text"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 12,00,000"
              className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          onClick={calculateInHand}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-md active:scale-95 cursor-pointer"
        >
          Calculate Breakup
        </button>

        {result && (
          <div className="mt-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-fade-in">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Monthly EPF:</span>
                <span className="font-bold text-stone-700">
                  ₹{result.monthlyEPF.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Monthly Tax:</span>
                <span className="font-bold text-red-500">
                  ₹{result.monthlyTax.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-px bg-indigo-200/50 my-1"></div>
              <div className="flex flex-col items-center pt-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                  Take Home Pay
                </span>
                <span className="text-2xl font-black text-emerald-600 leading-none">
                  ₹{result.monthlyInHand.toLocaleString("en-IN")}
                  <span className="text-xs font-medium text-emerald-500 ml-1">
                    /mo
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-[8px] text-stone-400 leading-tight text-center mt-auto pt-2">
          *Calculated for FY 2026-27. Includes ₹75k std. deduction, PT, and EPF.
        </p>
      </div>
    </div>
  );
}
