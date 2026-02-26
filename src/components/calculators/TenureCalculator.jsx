import React, { useState } from "react";
import ToolCard from "./ToolCard";

export default function TenureCalculator() {
  const [joinDate, setJoinDate] = useState("");
  const [result, setResult] = useState(null);

  const calculateTenure = () => {
    if (!joinDate) return;

    const j = new Date(joinDate);
    const t = new Date();

    let y = t.getFullYear() - j.getFullYear();
    let m = t.getMonth() - j.getMonth();
    let d = t.getDate() - j.getDate();

    if (d < 0) {
      m--;
      d += new Date(t.getFullYear(), t.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    setResult({ y, m, d });
  };

  return (
    <ToolCard
      title="Tenure Calculator"
      subtitle="Know how long you've been in your role"
      icon="fas fa-hourglass-half"
      iconClass="bg-slate-800"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Your Joining Date
          </label>
          <input
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm bg-stone-50"
          />
        </div>
        <button onClick={calculateTenure} className="w-full btn-primary py-3">
          Calculate Tenure
        </button>
      </div>

      {/* Only show this block if 'result' is not null */}
      {result && (
        <div className="mt-5 bg-stone-50 rounded-xl p-5 text-center border border-stone-100 animate-row">
          <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">
            Your Tenure
          </div>
          <div className="text-3xl font-display font-bold text-amber-600">
            {result.y}Y {result.m}M {result.d}D
          </div>

          {result.y >= 5 && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <i className="fas fa-check-circle"></i> Gratuity Eligible (5+
              Years)
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}
