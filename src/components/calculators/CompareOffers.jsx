// src/components/calculators/CompareOffers.jsx
import React, { useState } from "react";
import ToolCard from "./ToolCard";
import { calculate2026Details } from "./salaryUtils";

export default function CompareOffers() {
  const [currentCtc, setCurrentCtc] = useState("");
  const [offerCtc, setOfferCtc] = useState("");
  const [results, setResults] = useState(null);

  const formatAndSetCTC = (val, setter) => {
    let cleanVal = val.toString().replace(/\D/g, "");
    if (!cleanVal) {
      setter("");
      return;
    }
    setter(parseInt(cleanVal, 10).toLocaleString("en-IN"));
  };

  const calculateCompare = () => {
    const current = calculate2026Details(currentCtc);
    const offer = calculate2026Details(offerCtc);

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
    <ToolCard
      title="Compare Offers"
      subtitle="Current vs New In-Hand"
      icon="fas fa-rupee-sign"
      iconClass="bg-emerald-600"
      cardStyle={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
    >
      <div className="space-y-3 flex-grow flex flex-col">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Current CTC (₹)
          </label>
          <input
            type="text"
            value={currentCtc}
            onChange={(e) => formatAndSetCTC(e.target.value, setCurrentCtc)}
            placeholder="e.g. 8,00,000"
            className="w-full text-center px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            New Offer CTC (₹)
          </label>
          <input
            type="text"
            value={offerCtc}
            onChange={(e) => formatAndSetCTC(e.target.value, setOfferCtc)}
            placeholder="e.g. 12,00,000"
            className="w-full text-center px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm font-semibold bg-white text-slate-800 shadow-sm"
          />
        </div>

        <button
          onClick={calculateCompare}
          className="w-full py-2 mt-1 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors bg-emerald-600 shadow-sm"
        >
          Compare
        </button>

        {/* Compact Results Section */}
        {results && results.offer.monthlyInHand > 0 && (
          <div className="mt-3 space-y-2 animate-row flex-grow">
            <div className="bg-white rounded-lg p-3 text-center border border-emerald-100 shadow-sm">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">
                New Monthly In-Hand
              </div>
              <div className="text-2xl font-display font-black text-emerald-600">
                ₹{" "}
                {Math.round(results.offer.monthlyInHand).toLocaleString(
                  "en-IN",
                )}
              </div>
              <div className="mt-1.5 flex justify-between items-center text-[10px] px-2 py-1 bg-stone-50 rounded border border-stone-100">
                <span className="text-stone-500 font-semibold">
                  Yearly Tax:
                </span>
                <span className="text-red-500 font-bold">
                  ₹{" "}
                  {Math.round(results.offer.yearlyTax).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {results.current.monthlyInHand > 0 &&
              (() => {
                const diff =
                  results.offer.monthlyInHand - results.current.monthlyInHand;
                const isPositive = diff >= 0;
                const formattedDiff = Math.abs(Math.round(diff)).toLocaleString(
                  "en-IN",
                );
                return (
                  <div
                    className={`p-2 rounded-lg border flex items-center justify-between ${isPositive ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${isPositive ? "text-emerald-500" : "text-red-500"}`}
                    >
                      Difference
                    </span>
                    <span
                      className={`text-sm font-black ${isPositive ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {isPositive ? "+" : "-"} ₹ {formattedDiff}
                    </span>
                  </div>
                );
              })()}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
