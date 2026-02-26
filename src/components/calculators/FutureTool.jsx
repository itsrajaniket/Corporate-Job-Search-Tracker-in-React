// src/components/calculators/FutureTool.jsx
import React, { useState, useEffect } from "react";
import ToolCard from "./ToolCard";
import { calculate2026Details } from "./salaryUtils";

export default function FutureTool() {
  const [ctcInput, setCtcInput] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(null);

  const formatAndSetCTC = (val) => {
    let cleanVal = val.toString().replace(/\D/g, "");
    setCtcInput(cleanVal ? parseInt(cleanVal, 10).toLocaleString("en-IN") : "");
  };

  const adjustCTC = (amount) => {
    let currentVal = parseInt(ctcInput.replace(/\D/g, "")) || 0;
    let newVal = Math.max(0, currentVal + amount);
    formatAndSetCTC(newVal);
  };

  useEffect(() => {
    if (ctcInput) {
      const details = calculate2026Details(ctcInput);
      if (details && details.annualInHand) {
        const totalAnnualHours = hoursPerWeek * 52;
        setHourlyRate(details.annualInHand / totalAnnualHours);
      }
    } else {
      setHourlyRate(null);
    }
  }, [ctcInput, hoursPerWeek]);

  return (
    <ToolCard
      title="Hourly Value"
      subtitle="Your true hourly take-home"
      icon="fas fa-stopwatch"
      iconClass="bg-amber-600"
      cardStyle={{ background: "#fffbf2", borderColor: "#fde68a" }}
    >
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Annual CTC (₹)
          </label>
          <div className="relative flex items-center">
            <button
              onClick={() => adjustCTC(-100000)}
              className="absolute left-0 w-8 h-full flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded-l-lg transition-colors cursor-pointer"
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            <input
              type="text"
              value={ctcInput}
              onChange={(e) => formatAndSetCTC(e.target.value)}
              placeholder="e.g. 10,00,000"
              className="w-full text-center px-8 py-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm font-semibold bg-white text-slate-800"
            />
            <button
              onClick={() => adjustCTC(100000)}
              className="absolute right-0 w-8 h-full flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded-r-lg transition-colors cursor-pointer"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Hours/Week</span>
            <span className="text-amber-600">{hoursPerWeek} hrs</span>
          </label>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-stone-400 mt-1 font-medium">
            <span>Part Time</span>
            <span>Hustle (80+)</span>
          </div>
        </div>

        {hourlyRate !== null && (
          <div className="mt-auto bg-white rounded-lg p-4 text-center border border-amber-100 shadow-sm animate-row">
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">
              Net Hourly Rate
            </div>
            <div className="text-2xl font-display font-black text-amber-600">
              ₹ {Math.round(hourlyRate).toLocaleString("en-IN")}
              <span className="text-xs font-medium text-amber-500 ml-1">
                /hr
              </span>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
