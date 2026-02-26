import React, { useState } from "react";
import ToolCard from "./ToolCard";

export default function CompareOffers() {
  const [currentCtc, setCurrentCtc] = useState("");
  const [offerCtc, setOfferCtc] = useState("");
  const [results, setResults] = useState(null);

  // Safely formats numbers with commas while typing
  const formatAndSetCTC = (val, setter) => {
    let cleanVal = val.toString().replace(/\D/g, "");
    if (!cleanVal) {
      setter("");
      return;
    }
    setter(parseInt(cleanVal, 10).toLocaleString("en-IN"));
  };

  // The core 2026 math engine
  const calculateDetails = (ctcString) => {
    const ctc = parseFloat(ctcString.replace(/\D/g, ""));
    if (!ctc || isNaN(ctc)) return null;

    const basic = ctc * 0.5;
    const gratuity = basic * 0.0481;
    const pfEmployer = Math.min(basic * 0.12, 21600);
    const pfEmployee = pfEmployer;
    const fixedGross = ctc - pfEmployer - gratuity;

    let taxableIncome = Math.max(0, fixedGross - 75000);
    let tax = 0;

    // 2026 Budget Rules: Taxable income up to 12L is tax-free
    if (taxableIncome > 1200000) {
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
      tax = tax * 1.04; // 4% Cess
    }

    const annualInHand = fixedGross - pfEmployee - tax;

    return {
      monthlyInHand: annualInHand / 12,
      yearlyTax: tax,
    };
  };

  const calculateCompare = () => {
    const current = calculateDetails(currentCtc);
    const offer = calculateDetails(offerCtc);

    // If they only enter one CTC, we just show details for that one
    if (!offer && !current) {
      setResults(null);
      return;
    }

    setResults({
      current: current || { monthlyInHand: 0, yearlyTax: 0 },
      offer: offer || { monthlyInHand: 0, yearlyTax: 0 },
    });
  };

  return (
    <React.Fragment>
      <ToolCard
        title="Compare Offers"
        subtitle="Current vs New In-Hand"
        icon="fas fa-rupee-sign"
        iconClass="bg-emerald-600"
        cardStyle={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
      >
        <div className="space-y-4">
          {/* Input 1: Current CTC */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Current CTC (₹)
            </label>
            <input
              type="text"
              value={currentCtc}
              onChange={(e) => formatAndSetCTC(e.target.value, setCurrentCtc)}
              placeholder="e.g. 8,00,000"
              className="w-full text-center px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800"
            />
          </div>

          {/* Input 2: Offer CTC */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              New Offer CTC (₹)
            </label>
            <input
              type="text"
              value={offerCtc}
              onChange={(e) => formatAndSetCTC(e.target.value, setOfferCtc)}
              placeholder="e.g. 12,00,000"
              className="w-full text-center px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800 shadow-sm"
            />
          </div>

          <button
            onClick={calculateCompare}
            className="w-full py-3 text-white font-semibold rounded-xl cursor-pointer hover:bg-emerald-700 transition-colors bg-emerald-600 shadow-md"
          >
            Calculate Difference
          </button>
        </div>

        {results && results.offer.monthlyInHand > 0 && (
          <div className="mt-5 space-y-3 animate-row">
            {/* Main Result Card */}
            <div className="bg-white rounded-xl p-5 text-center border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">
                New Monthly In-Hand
              </div>
              <div className="text-3xl font-display font-black text-emerald-600">
                ₹{" "}
                {Math.round(results.offer.monthlyInHand).toLocaleString(
                  "en-IN",
                )}
              </div>

              <div className="mt-3 flex justify-between items-center text-xs px-2 py-2 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-stone-500 font-semibold">
                  Total Yearly Tax:
                </span>
                <span className="text-red-500 font-bold">
                  ₹{" "}
                  {Math.round(results.offer.yearlyTax).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* The Difference / Hike Calculator */}
            {results.current.monthlyInHand > 0 &&
              (() => {
                const diff =
                  results.offer.monthlyInHand - results.current.monthlyInHand;
                const isPositive = diff >= 0;
                // Math.abs perfectly separates the sign from the number so Indian commas work!
                const formattedDiff = Math.abs(Math.round(diff)).toLocaleString(
                  "en-IN",
                );

                return (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isPositive
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${isPositive ? "text-emerald-700" : "text-red-700"}`}
                    >
                      Monthly Difference
                    </span>
                    <span
                      className={`text-lg font-black ${isPositive ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {isPositive ? "+" : "-"} ₹ {formattedDiff}
                    </span>
                  </div>
                );
              })()}

            <div className="text-[9px] text-stone-400 text-center leading-tight pt-1">
              *Calculated using FY 2026-27 New Tax Regime.
              <br />
              Accounts for standard EPF and Gratuity deductions.
            </div>
          </div>
        )}
      </ToolCard>
    </React.Fragment>
  );
}
