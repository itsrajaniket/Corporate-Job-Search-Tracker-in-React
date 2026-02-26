import React, { useState, useMemo } from "react";
import CustomCompanyForm from "./CustomCompanyForm";
import FilterBar from "./FilterBar";
import CompanyTable from "./CompanyTable";

export default function Tracker({
  allCompanies,
  trackerData,
  onUpdateTracker,
  setCustomCompanies,
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
    // 1. Filter the data
    let filtered = allCompanies.filter((item) => {
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      let matchCat = true;

      if (activeFilter === "Applied Only") {
        matchCat =
          trackerData[item.name]?.status &&
          trackerData[item.name].status !== "Not Applied";
      } else if (activeFilter === "Custom Only") matchCat = item.isCustom;
      else if (activeFilter === "Important") matchCat = item.isImportant;
      else if (activeFilter === "Service-Based")
        matchCat = item.industry.includes("Service-Based");
      else if (activeFilter === "Product-Based")
        matchCat = item.industry.includes("Product-Based");
      else if (activeFilter === "Consulting")
        matchCat = item.industry.includes("Consulting");
      else if (activeFilter === "Banking")
        matchCat = item.industry.includes("Banking");
      else if (activeFilter === "Engineering Services")
        matchCat = item.industry.includes("Engineering");
      else if (activeFilter === "90 Days")
        matchCat = ["90 Days", "60-90 Days", "60 Days"].includes(item.policy);
      else if (activeFilter === "Buyout")
        matchCat = ["Possible", "Occasional", "Available"].includes(
          item.buyout,
        );

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

        {/* Custom Company Form */}
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
            setCustomCompanies((prev) => [newComp, ...prev]);
          }}
        />

        {/* Filters */}
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Table with Delete Prop */}
        <CompanyTable
          data={filteredAndSortedData}
          trackerData={trackerData}
          sortCol={sortCol}
          sortDesc={sortDesc}
          onSort={handleSort}
          onUpdateTracker={onUpdateTracker}
          onDeleteCustom={onDeleteCustomCompany} // <-- Pass it to the table
        />
      </div>
    </section>
  );
}
