import React, { useState } from "react";
import ToolCard from "./ToolCard";

export default function ExitDateCalculator() {
  const [resignationDate, setResignationDate] = useState("");
  const [noticeDuration, setNoticeDuration] = useState("90");
  const [result, setResult] = useState(null);

  const calculateExit = () => {
    if (!resignationDate) return;

    const e = new Date(resignationDate);
    e.setDate(e.getDate() + parseInt(noticeDuration));

    const lwdString = e.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const diffDays = Math.ceil((e - new Date()) / (1000 * 60 * 60 * 24));
    let daysLeftStr = "";
    if (diffDays > 0) daysLeftStr = `${diffDays} days from today`;
    else if (diffDays === 0) daysLeftStr = "That's today!";

    setResult({ date: lwdString, daysLeft: daysLeftStr });
  };

  return (
    <ToolCard
      title="Exit Date Calculator"
      subtitle="Your Last Working Day (LWD)"
      icon="far fa-calendar-times"
      iconClass="bg-amber-600"
      cardStyle={{ background: "#fffbf2", borderColor: "#fde68a" }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Resignation Date
          </label>
          <input
            type="date"
            value={resignationDate}
            onChange={(e) => setResignationDate(e.target.value)}
            className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Notice Period
          </label>
          <select
            value={noticeDuration}
            onChange={(e) => setNoticeDuration(e.target.value)}
            className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm bg-white"
          >
            <option value="90">90 Days</option>
            <option value="60">60 Days</option>
            <option value="45">45 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
        <button onClick={calculateExit} className="w-full btn-amber py-3">
          Calculate LWD
        </button>
      </div>

      {result && (
        <div className="mt-5 bg-white rounded-xl p-5 text-center border border-amber-100 animate-row">
          <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">
            Last Working Day
          </div>
          <div className="text-3xl font-display font-bold text-slate-800">
            {result.date}
          </div>
          <div className="mt-2 text-xs text-stone-500">{result.daysLeft}</div>
        </div>
      )}
    </ToolCard>
  );
}
