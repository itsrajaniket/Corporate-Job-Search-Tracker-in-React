import React, { useMemo } from "react";
import { companyData } from "./data/companyData";
import { useLocalStorage } from "./hooks/useLocalStorage";

import Navbar from "./components/layout/Navbar";
import HeroStats from "./components/hero/HeroStats";
import Tracker from "./components/tracker/Tracker";
import CareerTools from "./components/calculators/CareerTools";
import MarketCharts from "./components/dashboard/MarketCharts";
import Footer from "./components/layout/Footer";

export default function App() {
  // Load saved data from the browser's local storage
  const [customCompanies, setCustomCompanies] = useLocalStorage(
    "customCompanies_v5",
    [],
  );
  const [trackerData, setTrackerData] = useLocalStorage(
    "noticeTrackerMaster2",
    {},
  );

  // Combine the static master list with any companies the user added manually
  const allCompanies = useMemo(() => {
    return [...customCompanies, ...companyData];
  }, [customCompanies]);

  // THE FIX: Safely update tracker data so nothing ever becomes 'undefined'
  const handleUpdateTracker = (companyName, field, value) => {
    setTrackerData((prev) => {
      // Grab the existing data, or use a safe default if it's their first time interacting with this company
      const existing = prev[companyName] || {
        status: "Not Applied",
        notes: "",
      };

      return {
        ...prev,
        [companyName]: { ...existing, [field]: value },
      };
    });
  };

  // Handle restoring data from a JSON backup file
  const handleRestoreData = (importedTrackerData, importedCustomCompanies) => {
    if (importedTrackerData) setTrackerData(importedTrackerData);
    if (importedCustomCompanies) setCustomCompanies(importedCustomCompanies);
  };
  const handleDeleteCustomCompany = (companyName) => {
    if (!window.confirm(`Remove "${companyName}"?`)) return;
    setCustomCompanies((prev) => prev.filter((c) => c.name !== companyName));
  };
  // Handle resetting all statuses back to "Not Applied"
  const handleResetData = () => {
    if (!window.confirm("Reset all statuses? (Notes will remain)")) return;

    const resetData = { ...trackerData };
    Object.keys(resetData).forEach((key) => {
      if (resetData[key]) {
        resetData[key].status = "Not Applied";
      }
    });
    setTrackerData(resetData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation & Actions */}
      <Navbar
        allCompanies={allCompanies}
        trackerData={trackerData}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
      />

      <main className="flex-grow">
        {/* Top Statistics Board */}
        <HeroStats allCompanies={allCompanies} trackerData={trackerData} />

        {/* Main Interactive Table */}
        <Tracker
          allCompanies={allCompanies}
          trackerData={trackerData}
          onUpdateTracker={handleUpdateTracker}
          setCustomCompanies={setCustomCompanies}
          onDeleteCustomCompany={handleDeleteCustomCompany}
        />

        {/* Bonus Calculators */}
        <CareerTools />

        {/* Visual Analytics */}
        <MarketCharts allCompanies={allCompanies} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
