import React from "react";

export default function HeroStats({ allCompanies, trackerData }) {
  const total = allCompanies.length;
  let applied = 0,
    interviewing = 0,
    offers = 0,
    tracked = 0;

  allCompanies.forEach((c) => {
    const status = trackerData[c.name]?.status;
    if (status && status !== "Not Applied") tracked++;
    if (status === "Applied") applied++;
    if (status === "Interview") interviewing++;
    if (status === "Offer") offers++;
  });

  const progressPct = total ? Math.round((tracked / total) * 100) : 0;

  return (
    <section className="relative overflow-hidden bg-stone-50 pt-12 pb-14 border-b border-stone-200">
      {/* Subtle Pastel Background Glows for Depth */}
      <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-[sectionIn_0.8s_ease_forwards]">
        {/* Top Premium Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white rounded-full px-5 py-2 text-xs font-bold text-slate-600 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
          550+ Companies · Auto-saved locally
        </div>

        {/* Warm Gradient Heading */}
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
          Corporate Job Search
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500 drop-shadow-sm">
            Tracker
          </span>
        </h1>

        <p className="text-l text-slate-500 leading-relaxed mb-4 max-w-xl mx-auto font-medium">
          Track applications across{" "}
          <span className="font-semibold text-slate-700">
            India's leading companies
          </span>
          .<span className="font-semibold text-slate-700"> Compare offers</span>
          , calculate your
          <span className="font-semibold text-slate-700"> tax breakup</span> and
          <span className="font-semibold text-slate-700"> take-home pay</span>,
          discover your true
          <span className="font-semibold text-slate-700"> hourly value</span>,
          and plan your
          <span className="font-semibold text-slate-700">
            {" "}
            tenure and exit
          </span>{" "}
          instantly.
        </p>

        {/* Floating Light Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg border border-white rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200">
            <div className="text-2xl font-display font-black text-slate-800 mb-1">
              {total || "—"}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Companies
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-white rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50">
            <div className="text-2xl font-display font-black text-blue-600 mb-1">
              {applied}
            </div>
            <div className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
              Applied
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-white rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-amber-100/50 hover:shadow-2xl hover:shadow-amber-200/50">
            <div className="text-2xl font-display font-black text-amber-500 mb-1">
              {interviewing}
            </div>
            <div className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">
              Interviewing
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-white rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-emerald-100/50 hover:shadow-2xl hover:shadow-emerald-200/50">
            <div className="text-2xl font-display font-black text-emerald-500 mb-1">
              {offers}
            </div>
            <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">
              Offers
            </div>
          </div>
        </div>

        {/* Clean Progress Bar */}
        <div className="max-w-3xl mx-auto mt-10 bg-white/80 backdrop-blur-md border border-white p-6 rounded-2xl shadow-xl shadow-stone-200/50">
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <span>Application Progress</span>
            <span className="text-amber-600">{progressPct}% tracked</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden shadow-inner border border-stone-200/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full relative shadow-sm transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            >
              {/* Subtle shine effect on the progress bar */}
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
