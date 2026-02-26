import React, { useState, useMemo } from "react";
import CustomCompanyForm from "./CustomCompanyForm";
import FilterBar from "./FilterBar";
import CompanyTable from "./CompanyTable";

export default function Tracker({
  allCompanies,
  trackerData,
  onUpdateTracker,
  setCustomCompanies, // This now points directly to the cloud-saving function in App.jsx!
  onDeleteCustomCompany,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortCol, setSortCol] = useState("name");
  const [sortDesc, setSortDesc] = useState(false);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(false);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    // 0. DEDUPLICATE THE DATA (Fixes the Atos/Birlasoft double entries)
    // This looks at the company name and ensures it only ever renders once
    const uniqueCompanies = Array.from(
      new Map(allCompanies.map((item) => [item.name, item])).values(),
    );

    // 1. Filter the data
    let filtered = uniqueCompanies.filter((item) => {
      const safeName = item.name || "";
      const safeIndustry = item.industry || "";
      const safePolicy = item.policy || "";
      const safeBuyout = item.buyout || "";

      const matchSearch =
        !search || safeName.toLowerCase().includes(search.toLowerCase());
      let matchCat = true;

      // FIX: Using .includes() makes the filter immune to emojis or text changes!
      if (
        activeFilter.includes("My Tracked") ||
        activeFilter === "Applied Only"
      ) {
        const status = trackerData[item.name]?.status;
        matchCat = status && status !== "Not Applied";
      } else if (
        activeFilter.includes("Added by Me") ||
        activeFilter === "Custom Only"
      ) {
        matchCat = item.isCustom === true;
      } else if (
        activeFilter.includes("Must Apply") ||
        activeFilter === "Important"
      ) {
        matchCat = item.isImportant === true;
      } else if (activeFilter.includes("Service")) {
        matchCat = safeIndustry.includes("Service-Based");
      } else if (activeFilter.includes("Product")) {
        matchCat = safeIndustry.includes("Product-Based");
      } else if (activeFilter.includes("Consulting")) {
        matchCat = safeIndustry.includes("Consulting");
      } else if (activeFilter.includes("Banking")) {
        matchCat = safeIndustry.includes("Banking");
      } else if (activeFilter.includes("Engineering")) {
        matchCat = safeIndustry.includes("Engineering");
      } else if (activeFilter.includes("90 Days")) {
        matchCat = ["90 Days", "60-90 Days", "60 Days"].includes(safePolicy);
      } else if (activeFilter.includes("Buyo")) {
        matchCat = ["Possible", "Occasional", "Available", "Yes"].includes(
          safeBuyout,
        );
      }

      return matchSearch && matchCat;
    });

    // 2. Sort the data
    filtered.sort((a, b) => {
      let valA = a[sortCol] || "";
      let valB = b[sortCol] || "";

      if (sortCol === "policy") {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
        return sortDesc ? valB - valA : valA - valB;
      }

      return sortDesc
        ? valB.toString().localeCompare(valA.toString())
        : valA.toString().localeCompare(valB.toString());
    });

    return filtered;
  }, [allCompanies, trackerData, search, activeFilter, sortCol, sortDesc]);
  return (
    <section
      id="tracker"
      className="py-14 bg-stone-50 border-b border-stone-200"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">
              <i className="fas fa-briefcase text-amber-600 mr-2"></i>
              Application Tracker
            </h2>
            <p className="text-stone-400 mt-1 text-sm">
              Click any company to open its career page. Click headers to sort.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search companies…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
              <i className="fas fa-search absolute left-3 top-3 text-stone-300 text-sm"></i>
            </div>
          </div>
        </div>

        {/* Custom Company Form with Duplicate Check */}
        <CustomCompanyForm
          onAddCompany={(newComp) => {
            // Check if company already exists before adding
            if (
              allCompanies.some(
                (c) => c.name.toLowerCase() === newComp.name.toLowerCase(),
              )
            ) {
              alert("This company is already in your tracker!");
              return;
            }
            // Simply pass the new company up to App.jsx to handle cloud saving!
            setCustomCompanies(newComp);
          }}
        />

        {/* Filters */}
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Table */}
        <CompanyTable
          data={filteredAndSortedData}
          trackerData={trackerData}
          sortCol={sortCol}
          sortDesc={sortDesc}
          onSort={handleSort}
          onUpdateTracker={onUpdateTracker}
          onDeleteCustom={onDeleteCustomCompany}
        />
      </div>
    </section>
  );
}
