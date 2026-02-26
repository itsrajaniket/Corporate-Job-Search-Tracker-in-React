import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register the required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function MarketCharts({ allCompanies }) {
  // We use useMemo so the charts only recalculate when the company data actually changes
  const { sectorChartData, buyoutChartData, noticeChartData } = useMemo(() => {
    const sectors = {};
    const buyoutRaw = {};
    const noticeRaw = {};

    allCompanies.forEach((c) => {
      // 1. Sector Aggregation
      const ind = c.industry || "Other";
      sectors[ind] = (sectors[ind] || 0) + 1;

      // 2. Buyout Aggregation
      if (!buyoutRaw[ind]) buyoutRaw[ind] = { total: 0, possible: 0 };
      buyoutRaw[ind].total++;
      if (["Possible", "Occasional", "Available"].includes(c.buyout)) {
        buyoutRaw[ind].possible++;
      }

      // 3. Notice Period Aggregation
      const policy =
        c.policy && c.policy !== "Data Not Found" ? c.policy : "Unknown";
      noticeRaw[policy] = (noticeRaw[policy] || 0) + 1;
    });

    // --- Format Data for Sector Doughnut Chart ---
    const sectorChartData = {
      labels: Object.keys(sectors),
      datasets: [
        {
          data: Object.values(sectors),
          backgroundColor: [
            "#475569",
            "#10b981",
            "#d97706",
            "#e11d48",
            "#7c3aed",
            "#94a3b8",
          ],
          borderWidth: 0,
        },
      ],
    };

    // --- Format Data for Buyout Bar Chart ---
    const barLabels = Object.keys(buyoutRaw).slice(0, 5);
    const barPct = barLabels.map(
      (l) =>
        Math.round((buyoutRaw[l].possible / buyoutRaw[l].total) * 100) || 0,
    );

    const buyoutChartData = {
      labels: barLabels,
      datasets: [
        {
          label: "Buyout Likelihood (%)",
          data: barPct,
          backgroundColor: [
            "#94a3b8",
            "#d97706",
            "#10b981",
            "#e11d48",
            "#7c3aed",
          ],
          borderRadius: 6,
        },
      ],
    };

    // --- Format Data for Notice Period Doughnut Chart ---
    const noticeLabels = Object.keys(noticeRaw).sort(
      (a, b) => noticeRaw[b] - noticeRaw[a],
    );
    const noticeCounts = noticeLabels.map((l) => noticeRaw[l]);

    const noticeChartData = {
      labels: noticeLabels,
      datasets: [
        {
          data: noticeCounts,
          backgroundColor: [
            "#ef4444",
            "#f59e0b",
            "#10b981",
            "#3b82f6",
            "#e2e8f0",
            "#94a3b8",
          ],
          borderWidth: 0,
        },
      ],
    };

    return { sectorChartData, buyoutChartData, noticeChartData };
  }, [allCompanies]);

  return (
    <section id="dashboard" className="py-14 bg-stone-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Market Data Overview
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Live data based on tracked companies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Industry Distribution Chart */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold text-slate-800 mb-4 text-sm">
              Industry Distribution
            </h3>
            <div className="chart-wrap">
              <Doughnut
                data={sectorChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "68%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { font: { size: 11 }, boxWidth: 12 },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Buyout Availability Chart */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold text-slate-800 mb-4 text-sm">
              Buyout Availability by Sector
            </h3>
            <div className="chart-wrap">
              <Bar
                data={buyoutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  scales: {
                    x: {
                      max: 100,
                      grid: { color: "#f1f0ed" },
                      ticks: { font: { size: 11 }, callback: (v) => v + "%" },
                    },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>

          {/* Notice Period Chart */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold text-slate-800 mb-4 text-sm">
              Notice Period Spread
            </h3>
            <div className="chart-wrap">
              <Doughnut
                data={noticeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "65%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { font: { size: 11 }, boxWidth: 12 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
