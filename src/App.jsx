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
      } else {
        // 🔴 FIX: WHEN USER SIGNS OUT, WIPE THE SCREEN DATA!
        setTrackerData({});
        setCustomCompanies([]);
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

  // 3. Simple Google Login
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
        {/* 🔴 FIX: THE TRACKER IS NOW LOCKED BEHIND LOGIN! */}
        {user ? (
          <Tracker
            allCompanies={allCompanies}
            trackerData={trackerData}
            onUpdateTracker={handleUpdateTracker}
            setCustomCompanies={handleAddCustomCompany}
            onDeleteCustomCompany={handleDeleteCustomCompany}
          />
        ) : (
          <section id="tracker" className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 py-20 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
              {/* Decorative background blur */}
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              <div className="w-20 h-20 bg-stone-50 text-stone-300 rounded-2xl flex items-center justify-center mb-6 border border-stone-200 shadow-inner relative z-10">
                <i className="fas fa-lock text-3xl"></i>
              </div>

              <h2 className="text-3xl font-display font-black text-slate-800 mb-3 relative z-10">
                Company Tracker Locked
              </h2>

              <p className="text-stone-500 mb-8 max-w-lg mx-auto font-medium relative z-10">
                Sign in with Google to access the full database of 550+
                companies, track your job applications, add custom leads, and
                securely sync your progress to the cloud.
              </p>

              <button
                onClick={handleLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-slate-300 hover:-translate-y-1 transition-all flex items-center gap-3 relative z-10 cursor-pointer"
              >
                <i className="fab fa-google text-amber-400 text-lg"></i>
                Unlock Company Database
              </button>
            </div>
          </section>
        )}

        {/* These tools are free for everyone to use! */}
        <CareerTools />
        <MarketCharts allCompanies={allCompanies} />
      </main>

      <Footer />
    </div>
  );
}
