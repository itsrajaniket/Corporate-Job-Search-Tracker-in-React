// src/components/calculators/ToolCard.jsx
import React from "react";

export default function ToolCard({
  title,
  subtitle,
  icon,
  iconClass,
  cardStyle,
  children,
}) {
  return (
    <div
      className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col h-full transition-all"
      style={cardStyle}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-xl text-white flex items-center justify-center ${iconClass}`}
        >
          <i className={icon}></i>
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex-grow flex flex-col">{children}</div>
    </div>
  );
}
