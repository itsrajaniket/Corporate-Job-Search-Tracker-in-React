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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Prevents flashing the login screen on refresh

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
        // User logged in: Fetch cloud data
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            if (cloudData.trackerData) setTrackerData(cloudData.trackerData);
            if (cloudData.customCompanies)
              setCustomCompanies(cloudData.customCompanies);
          } else {
            // BRAND NEW USER FIX: Wipe old local data and create a fresh cloud save
            setTrackerData({});
            setCustomCompanies([]);
            // We save empty data to the cloud so Firebase knows this new user exists
            await setDoc(docRef, { trackerData: {}, customCompanies: [] });
          }
        } catch (error) {
          console.error("Error fetching cloud data:", error);
        }
      } else {
        // User logged out: Wipe the screen's memory immediately!
        setTrackerData({});
        setCustomCompanies([]);
      }

      setIsCheckingAuth(false); // Finished checking!
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

  // Prevent UI flashing while Firebase checks if you are logged in
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <i className="fas fa-circle-notch fa-spin text-4xl text-amber-600"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        allCompanies={allCompanies}
        trackerData={trackerData}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
      />

      {/* THE GATEWAY: Show Dashboard IF logged in, else show Landing Page */}
      {user ? (
        <main className="flex-grow">
          <HeroStats allCompanies={allCompanies} trackerData={trackerData} />
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
      ) : (
        <main className="flex-grow flex items-center justify-center bg-stone-50 px-6 py-20">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200 p-10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
              <i className="fas fa-lock"></i>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
              Your Job Search, Anchored.
            </h1>
            <p className="text-stone-500 mb-8 leading-relaxed">
              Sign in to access your cloud-synced dashboard. Track applications,
              analyze market data, and never lose a job lead again.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg cursor-pointer"
            >
              <i className="fab fa-google text-amber-400"></i> Continue with
              Google
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
