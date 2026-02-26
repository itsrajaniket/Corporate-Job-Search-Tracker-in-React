import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 py-8">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <i className="fas fa-anchor text-amber-500"></i>
          <span className="font-display font-semibold text-slate-700">
            90-Day Anchor
          </span>
        </div>
        <div className="text-xs text-stone-400">
          Data is saved locally. Use "Data &gt; Backup" to save across devices.
        </div>
      </div>
    </footer>
  );
}
