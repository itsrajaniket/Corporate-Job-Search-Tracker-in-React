import React, { useState } from "react";

export default function PremiumUpgrade({ onUnlockSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Function to safely load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. The Checkout Handler
  const handleCheckout = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay failed to load. Are you offline?");
      setIsProcessing(false);
      return;
    }

    // 3. Configure the Checkout Modal
    const options = {
      // NOTE: We use a generic Test Key here. Later, you can swap it for your own!
      key: "rzp_live_SKwCdzsUJ5f8sQ",
      amount: "2100", // Razorpay uses paise!
      currency: "INR",
      name: "Job Tracker Pro",
      description: "Lifetime Access to Cloud Sync",
      image: "https://cdn-icons-png.flaticon.com/512/2942/2942789.png", // A nice anchor icon
      handler: function (response) {
        // This function runs ONLY if the dummy payment succeeds!
        console.log("Payment ID:", response.razorpay_payment_id);
        alert(`Success! Mock Payment ID: ${response.razorpay_payment_id}`);

        // Tell the main app to unlock the premium features!
        if (onUnlockSuccess) onUnlockSuccess();
        setIsProcessing(false);
      },
      prefill: {
        name: "Hiring Manager",
        email: "recruiter@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#6366f1", // Indigo-500 to match your UI
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    // 4. Open the Gateway
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 max-w-sm mx-auto shadow-2xl border border-slate-700 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-indigo-500/30">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>

        <h2 className="text-2xl font-display font-bold mb-2">
          Unlock Pro Sync
        </h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Access your job tracker across all devices. Secure cloud database
          powered by Firebase.
        </p>

        <div className="text-4xl font-black mb-8 text-white">
          ₹99
          <span className="text-sm font-medium text-slate-500">
            {" "}
            / lifetime
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fas fa-lock"></i>
          )}
          {isProcessing ? "Connecting to Gateway..." : "Pay with Razorpay"}
        </button>

        <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-semibold">
          Pro Mode Enabled
        </p>
      </div>
    </div>
  );
}
