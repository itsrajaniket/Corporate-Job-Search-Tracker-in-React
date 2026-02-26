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
    <section className="hero-pattern border-b border-stone-200 pt-14 pb-16">
      <div className="max-w-3xl mx-auto px-6 text-center animate-[sectionIn_0.5s_ease_forwards]">
        <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-semibold text-stone-600 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          550+ Companies · Auto-saved locally
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
          Corporate Job Search
          <br />
          <span className="text-amber-600">Tracker</span>
        </h1>

        <p className="text-lg text-stone-500 leading-relaxed mb-10 max-w-xl mx-auto">
          Track applications across India's biggest IT, product, consulting &
          fintech companies. Calculate your notice period exit date instantly.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="stat-pill text-center">
            <div className="text-2xl font-display font-bold text-slate-800">
              {total || "—"}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Companies</div>
          </div>
          <div className="stat-pill text-center">
            <div className="text-2xl font-display font-bold text-blue-600">
              {applied}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Applied</div>
          </div>
          <div className="stat-pill text-center">
            <div className="text-2xl font-display font-bold text-amber-600">
              {interviewing}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Interviewing</div>
          </div>
          <div className="stat-pill text-center">
            <div className="text-2xl font-display font-bold text-emerald-600">
              {offers}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Offers</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-5">
          <div className="flex justify-between text-xs text-stone-400 mb-1.5">
            <span>Application Progress</span>
            <span>{progressPct}% tracked</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
