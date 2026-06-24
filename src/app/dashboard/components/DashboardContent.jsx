"use client";

import React from "react";
import { DashboardStatsSkeleton } from "@/app/components/SkeletonLoader";

export default function DashboardContent({ stats = [], history = [], role = "user", isLoading = false }) {
  const historyHeading = role === "lawyer" ? "Work History" : "Hire History";
  const emptyMessage   = role === "lawyer"
    ? "No work history yet. Your cases will appear here."
    : "No hire history yet. Lawyers you book will appear here.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 16 }}>
      <style>{`
        @media (min-width: 640px) { .dc-wrap { padding: 24px !important; gap: 24px !important; } }
        .dc-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px)  { .dc-stats { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; } }
        .dc-history-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        @media (min-width: 480px) {
          .dc-history-row { flex-direction: row; justify-content: space-between; align-items: center; }
        }
      `}</style>

      {/* Stats */}
      <section>
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="dc-stats">
            {stats.map((stat) => (
              <div key={stat.label} style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f8fafc" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section style={{ borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: 18 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {historyHeading}
        </h2>

        {history.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{emptyMessage}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                <div className="dc-history-row" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>{item.title}</span>
                  {item.date && <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0 }}>{item.date}</span>}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
