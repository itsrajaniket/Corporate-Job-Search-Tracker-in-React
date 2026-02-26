import React, { useRef, useState, useEffect } from "react";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar({ onRestoreData, onResetData }) {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  // This listener checks if the user is already logged in when they open the app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onRestoreData(data.tracker, data.custom);
        alert("Data restored successfully!");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const exportJSON = () => {
    alert("Local JSON export is active. Cloud sync coming next!");
  };

  return (
    <nav className="nav-glass sticky top-0 z-50 shadow-sm">
      <input
        type="file"
        accept=".json"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-[60px]">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
            <i className="fas fa-anchor text-white text-sm"></i>
          </div>
          <span className="font-display font-bold text-lg text-slate-900">
            90-Day Anchor
          </span>
          <span className="hidden sm:inline text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            India Job Tracker
          </span>
        </div>

        {/* Links & Actions Section */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <a
            href="#tracker"
            className="text-stone-500 hover:text-amber-600 transition-colors"
          >
            Tracker
          </a>
          <a
            href="#tools"
            className="text-stone-500 hover:text-amber-600 transition-colors"
          >
            Calculators
          </a>
          <a
            href="#dashboard"
            className="text-stone-500 hover:text-amber-600 transition-colors"
          >
            Market Data
          </a>

          <div className="h-4 w-px bg-stone-300 mx-2"></div>

          {/* Legacy Local Data Dropdown */}
          <div className="relative group">
            <button className="text-stone-500 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer">
              <i className="fas fa-database"></i> Local Data
              <i className="fas fa-chevron-down text-[10px]"></i>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
              <button
                onClick={exportJSON}
                className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-amber-600 cursor-pointer"
              >
                <i className="fas fa-download w-4 text-center mr-2"></i> Backup
                (JSON)
              </button>
              <button
                onClick={handleImportClick}
                className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-amber-600 cursor-pointer"
              >
                <i className="fas fa-upload w-4 text-center mr-2"></i> Restore
                (JSON)
              </button>
              <div className="h-px bg-stone-100 my-1"></div>
              <button
                onClick={onResetData}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <i className="fas fa-rotate-left w-4 text-center mr-2"></i>{" "}
                Reset Statuses
              </button>
            </div>
          </div>

          <div className="h-4 w-px bg-stone-300 mx-2"></div>

          {/* Firebase Authentication UI */}
          {user ? (
            <div className="flex items-center gap-3 bg-white border border-stone-200 pl-2 pr-4 py-1 rounded-full shadow-sm">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 leading-tight uppercase font-bold">
                  Cloud Sync Active
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-slate-700 hover:text-red-500 text-left transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="btn-primary flex items-center gap-2"
            >
              <i className="fab fa-google"></i> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
