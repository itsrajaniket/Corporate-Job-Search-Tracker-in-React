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
    <div className="calc-card" style={cardStyle}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-xl text-white flex items-center justify-center ${iconClass}`}
        >
          <i className={icon}></i>
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-stone-400">{subtitle}</p>
        </div>
      </div>

      {/* This is where the specific calculator inputs/buttons will go */}
      {children}
    </div>
  );
}
