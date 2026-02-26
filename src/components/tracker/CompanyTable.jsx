import React from "react";

export default function CompanyTable({
  data,
  trackerData,
  sortCol,
  sortDesc,
  onSort,
  onUpdateTracker,
  onDeleteCustom,
}) {
  const getIndustryBadge = (industry) => {
    const map = {
      "Service-Based": "ib-service",
      "Product-Based": "ib-product",
      Consulting: "ib-consult",
      Banking: "ib-banking",
      "Engineering Services": "ib-eng",
    };
    return `industry-badge ${map[industry] || "ib-default"}`;
  };

  const getBuyoutClass = (b) => {
    if (
      !b ||
      b === "Unknown" ||
      b === "Data Not Found" ||
      b === "Not Available" ||
      b === "No"
    )
      return "buyout-none";
    if (b.includes("Rare") || b.includes("Very Rare")) return "buyout-rare";
    if (b === "Occasional") return "buyout-ok";
    return "buyout-good";
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-auto relative" style={{ maxHeight: "680px" }}>
        <table className="company-table min-w-full">
          <thead>
            <tr>
              <th
                className="text-left w-[30%] cursor-pointer select-none"
                onClick={() => onSort("name")}
              >
                Company
                <i
                  className={`fas ${sortCol === "name" ? (sortDesc ? "fa-sort-down text-amber-600" : "fa-sort-up text-amber-600") : "fa-sort"} text-stone-300 ml-1`}
                ></i>
              </th>
              <th
                className="text-left cursor-pointer select-none"
                onClick={() => onSort("industry")}
              >
                Industry
                <i
                  className={`fas ${sortCol === "industry" ? (sortDesc ? "fa-sort-down text-amber-600" : "fa-sort-up text-amber-600") : "fa-sort"} text-stone-300 ml-1`}
                ></i>
              </th>
              <th
                className="text-left w-32 cursor-pointer select-none"
                title="Typical notice period"
                onClick={() => onSort("policy")}
              >
                Notice
                <i
                  className={`fas ${sortCol === "policy" ? (sortDesc ? "fa-sort-down text-amber-600" : "fa-sort-up text-amber-600") : "fa-sort"} text-stone-300 ml-1`}
                ></i>
              </th>
              <th
                className="text-left w-28 cursor-pointer select-none"
                title="Can you buy out your notice period?"
              >
                Buyout
              </th>
              <th className="text-left w-44 select-none">My Status</th>
              <th className="text-left select-none">Notes</th>
            </tr>
          </thead>
          <tbody>
            {/* If the filter finds nothing, show this single empty state row */}
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16 text-stone-400">
                  No companies found matching criteria.
                </td>
              </tr>
            ) : (
              /* If the filter finds matches, map over ONLY those matches */
              data.map((company) => {
                const us = trackerData[company.name] || {};
                const currentStatus = us.status || "Not Applied";
                const currentNotes = us.notes || "";

                return (
                  <tr key={company.name} className="animate-row">
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <a
                          href={company.career || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors inline-flex items-center gap-1 group"
                        >
                          {company.name}
                          <i className="fas fa-external-link-alt text-[9px] opacity-0 group-hover:opacity-60 transition-opacity"></i>
                        </a>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {company.isImportant && (
                            <span className="tag tag-fire">
                              <i className="fas fa-fire mr-0.5"></i>Must Apply
                            </span>
                          )}
                          {company.isCustom && (
                            <div className="flex items-center gap-1">
                              <span className="tag tag-custom">Mine</span>
                              <button
                                onClick={() => onDeleteCustom(company.name)}
                                className="text-red-300 hover:text-red-500 cursor-pointer"
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={getIndustryBadge(company.industry)}>
                        {company.industry}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-xs ${company.policy === "Data Not Found" ? "text-stone-300 italic" : "font-semibold text-slate-700"}`}
                      >
                        {company.policy === "Data Not Found"
                          ? "—"
                          : company.policy}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-xs ${getBuyoutClass(company.buyout)}`}
                      >
                        {company.buyout === "Unknown" ? "—" : company.buyout}
                      </span>
                    </td>
                    <td>
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          onUpdateTracker(
                            company.name,
                            "status",
                            e.target.value,
                          )
                        }
                        className={`status-select ${currentStatus !== "Not Applied" ? "st-" + currentStatus.toLowerCase() : ""}`}
                      >
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">📍 Applied</option>
                        <option value="Interview">💬 Interview</option>
                        <option value="Offer">🎉 Offer</option>
                        <option value="Rejected">⛔ Rejected</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentNotes}
                        onChange={(e) =>
                          onUpdateTracker(company.name, "notes", e.target.value)
                        }
                        placeholder="Add note…"
                        className="notes-input"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {data.length} companies shown
        </span>
        <span className="text-xs text-stone-400">
          <i className="fas fa-check-circle mr-1 text-emerald-500"></i>
          Auto-saved
        </span>
      </div>
    </div>
  );
}
