import React from "react";

export default function StatPill({ icon, label, value }) {
  return (
    <div className="stat-pill">
      {icon}
      <span>{label}</span>
      <span className="stat-pill-value">{value}</span>
    </div>
  );
}
