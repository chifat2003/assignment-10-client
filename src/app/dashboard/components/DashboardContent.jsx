"use client";

import React from "react";

/**
 * Reusable dashboard content – works for both user and lawyer dashboards.
 *
 * @param {Array}  stats   – Array of { label, value } for top stat cards.
 * @param {Array}  history – Array of { title, description, date? } for history list.
 * @param {string} role    – "user" or "lawyer" (adjusts heading text).
 */
export default function DashboardContent({ stats = [], history = [], role = "user" }) {
  const historyHeading = role === "lawyer" ? "Work History" : "Hire History";
  const emptyMessage =
    role === "lawyer"
      ? "No work history yet. Your cases will appear here."
      : "No hire history yet. Lawyers you book will appear here.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
      {/* ── Stats cards ── */}
      <section>
        {/* <h2
          style={{
            margin: "0 0 14px",
            fontSize: 15,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Overview
        </h2> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 14,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: 18,
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                {stat.label}
              </p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── History section ── */}
      <section
        style={{
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: 20,
        }}
      >
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 15,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {historyHeading}
        </h2>

        {history.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{emptyMessage}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>
                    {item.title}
                  </span>
                  {item.date && <span style={{ fontSize: 12, color: "#64748b" }}>{item.date}</span>}
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