import React, { useState, useEffect, useMemo } from "react";
import { companyData } from "./data/companyData";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Firebase Imports
import { auth, db, googleProvider } from "./firebase";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Navbar from "./components/layout/Navbar";
import HeroStats from "./components/hero/HeroStats";
import Tracker from "./components/tracker/Tracker";
import CareerTools from "./components/calculators/CareerTools";
import MarketCharts from "./components/dashboard/MarketCharts";
import Footer from "./components/layout/Footer";

export default function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [customCompanies, setCustomCompanies] = useLocalStorage(
    "customCompanies_v5",
    [],
  );
  const [trackerData, setTrackerData] = useLocalStorage(
    "noticeTrackerMaster2",
    {},
  );

  // 1. Listen for Login/Logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            if (cloudData.trackerData) setTrackerData(cloudData.trackerData);
            if (cloudData.customCompanies)
              setCustomCompanies(cloudData.customCompanies);
          } else {
            setTrackerData({});
            setCustomCompanies([]);
            await setDoc(docRef, { trackerData: {}, customCompanies: [] });
          }
        } catch (error) {
          console.error("Error fetching cloud data:", error);
        }
      }
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. The Cloud Saver Function
  const saveToCloud = async (updatedTracker, updatedCustom) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        trackerData: updatedTracker,
        customCompanies: updatedCustom,
      });
    } catch (error) {
      console.error("Error saving to cloud:", error);
    }
  };

  // 3. Simple Google Login (No Paywall)
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const allCompanies = useMemo(() => {
    return [...customCompanies, ...companyData];
  }, [customCompanies]);

  const handleUpdateTracker = (companyName, field, value) => {
    setTrackerData((prev) => {
      const existing = prev[companyName] || {
        status: "Not Applied",
        notes: "",
      };
      const updatedData = {
        ...prev,
        [companyName]: { ...existing, [field]: value },
      };
      saveToCloud(updatedData, customCompanies);
      return updatedData;
    });
  };

  const handleAddCustomCompany = (newComp) => {
    setCustomCompanies((prev) => {
      const updatedCustom = [newComp, ...prev];
      saveToCloud(trackerData, updatedCustom);
      return updatedCustom;
    });
  };

  const handleDeleteCustomCompany = (companyName) => {
    if (!window.confirm(`Remove "${companyName}"?`)) return;
    setCustomCompanies((prev) => {
      const updatedCustom = prev.filter((c) => c.name !== companyName);
      saveToCloud(trackerData, updatedCustom);
      return updatedCustom;
    });
  };

  const handleRestoreData = (importedTrackerData, importedCustomCompanies) => {
    if (importedTrackerData) setTrackerData(importedTrackerData);
    if (importedCustomCompanies) setCustomCompanies(importedCustomCompanies);
    saveToCloud(importedTrackerData, importedCustomCompanies);
  };

  const handleResetData = () => {
    if (!window.confirm("Reset all statuses? (Notes will remain)")) return;
    const resetData = { ...trackerData };
    Object.keys(resetData).forEach((key) => {
      if (resetData[key]) resetData[key].status = "Not Applied";
    });
    setTrackerData(resetData);
    saveToCloud(resetData, customCompanies);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <i className="fas fa-circle-notch fa-spin text-4xl text-amber-600"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Pass the simple handleLogin to Navbar */}
      <Navbar
        allCompanies={allCompanies}
        trackerData={trackerData}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
        user={user}
        onLogin={handleLogin}
        onLogout={() => auth.signOut()}
      />

      <HeroStats allCompanies={allCompanies} trackerData={trackerData} />

      <main className="flex-grow">
        <Tracker
          allCompanies={allCompanies}
          trackerData={trackerData}
          onUpdateTracker={handleUpdateTracker}
          setCustomCompanies={handleAddCustomCompany}
          onDeleteCustomCompany={handleDeleteCustomCompany}
        />
        <CareerTools />
        <MarketCharts allCompanies={allCompanies} />
      </main>

      <Footer />
    </div>
  );
}
