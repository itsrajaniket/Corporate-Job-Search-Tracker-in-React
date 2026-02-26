import React from "react";

const FILTERS = [
  { id: "All", label: "All Companies", icon: null },
  { separator: true },
  {
    id: "Applied Only",
    label: "My Tracked",
    icon: "fas fa-star text-amber-400",
  },
  {
    id: "Custom Only",
    label: "Added by Me",
    icon: "fas fa-user-plus text-indigo-400",
  },
  { id: "Important", label: "Must Apply", icon: "fas fa-fire text-orange-500" },
  { separator: true },
  {
    id: "Service-Based",
    label: "Service",
    icon: "fas fa-server text-blue-400",
  },
  {
    id: "Product-Based",
    label: "Product",
    icon: "fas fa-box text-emerald-500",
  },
  {
    id: "Consulting",
    label: "Consulting",
    icon: "fas fa-chart-line text-amber-500",
  },
  { id: "Banking", label: "Banking", icon: "fas fa-university text-rose-400" },
  {
    id: "Engineering Services",
    label: "Engineering",
    icon: "fas fa-cogs text-purple-400",
  },
  { separator: true },
  { id: "90 Days", label: "60-90 Days", icon: "fas fa-calendar text-red-400" },
  {
    id: "Buyout",
    label: "Buyout OK",
    icon: "fas fa-money-bill text-green-500",
  },
];

export default function FilterBar({ activeFilter, setActiveFilter }) {
  return (
    <div className="mb-5 overflow-x-auto no-scrollbar pb-1">
      <div className="flex gap-2 items-center w-max">
        {FILTERS.map((filter, index) => {
          // If it's a separator line, render a small vertical divider
          if (filter.separator) {
            return (
              <div
                key={`sep-${index}`}
                className="w-px h-5 bg-stone-200 mx-1"
              ></div>
            );
          }

          // Otherwise, render the clickable filter button
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
            >
              {filter.icon && <i className={`${filter.icon} mr-1`}></i>}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
