// src/components/calculators/CareerTools.jsx
import React from "react";
import TenureCalculator from "./TenureCalculator";
import ExitDateCalculator from "./ExitDateCalculator";
import SalaryCalculator from "./SalaryCalculator";
import TaxCalculator from "./TaxCalculator";

import CompareOffers from "./CompareOffers";
// import FutureTool from "./FutureTool"; <-- Ready for your next addition!

export default function CareerTools() {
  return (
    <section id="tools" className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-slate-900">
            <i className="fas fa-calculator text-amber-600 mr-2"></i>Career
            Tools
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            Plan your exit with precision
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TenureCalculator />
          <ExitDateCalculator />
          <SalaryCalculator />
          <TaxCalculator />
          {/* <FutureTool /> */}
          <CompareOffers />
        </div>
      </div>
    </section>
  );
}
