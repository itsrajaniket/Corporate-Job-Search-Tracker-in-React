import React, { useRef } from "react";

export default function Navbar({
  onRestoreData,
  onResetData,
  user,
  onLogin,
  onLogout,
}) {
  const fileInputRef = useRef(null);

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

  // Bonus: Actually downloads the local data as a JSON file!
  const exportJSON = () => {
    try {
      const tracker = JSON.parse(
        localStorage.getItem("noticeTrackerMaster2") || "{}",
      );
      const custom = JSON.parse(
        localStorage.getItem("customCompanies_v5") || "[]",
      );

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ tracker, custom }));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "job_tracker_backup.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      alert("Error exporting data.");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 shadow-sm">
      <input
        type="file"
        accept=".json"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-[65px]">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-200">
            <i className="fas fa-anchor text-white text-sm"></i>
          </div>
          <span className="font-display font-black text-xl text-slate-800 tracking-tight">
            90-Day Anchor
          </span>
          <span className="hidden sm:inline text-[10px] bg-stone-100 text-stone-500 border border-stone-200 px-2 py-1 rounded-md font-bold uppercase tracking-wider ml-1">
            India
          </span>
        </div>

        {/* Links & Actions Section */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
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

          <div className="h-5 w-px bg-stone-200 mx-1"></div>

          {/* Local Data Dropdown */}
          <div className="relative group">
            <button className="text-stone-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-stone-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-stone-200">
              <i className="fas fa-database text-xs"></i> Local Data
              <i className="fas fa-chevron-down text-[9px] ml-0.5"></i>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl shadow-stone-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
              <button
                onClick={exportJSON}
                className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-amber-600 cursor-pointer font-medium"
              >
                <i className="fas fa-download w-4 text-center mr-2"></i> Backup
                (JSON)
              </button>
              <button
                onClick={handleImportClick}
                className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-amber-600 cursor-pointer font-medium"
              >
                <i className="fas fa-upload w-4 text-center mr-2"></i> Restore
                (JSON)
              </button>
              <div className="h-px bg-stone-100 my-1"></div>
              <button
                onClick={onResetData}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer font-medium"
              >
                <i className="fas fa-rotate-left w-4 text-center mr-2"></i>{" "}
                Reset Statuses
              </button>
            </div>
          </div>

          <div className="h-5 w-px bg-stone-200 mx-1"></div>

          {/* Firebase Authentication UI */}
          {user ? (
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-[9px] text-emerald-600 leading-tight uppercase font-black tracking-wider">
                  Cloud Synced
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-slate-700 hover:text-red-500 text-left transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md shadow-slate-200 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <i className="fab fa-google text-amber-400"></i> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
