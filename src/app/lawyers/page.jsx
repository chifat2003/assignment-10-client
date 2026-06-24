"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import lawyersData from "@/app/data/lawyers.json";
import { LawyerCardSkeleton } from "@/app/components/SkeletonLoader";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
          fill={rating >= star ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function LawyerListCard({ lawyer }) {
  return (
    <Link href={`/lawyers/${lawyer.id}`} style={{ textDecoration: "none" }}>
      <div
        className="lawyer-card"
        style={{
          padding: 16,
          borderRadius: 16,
          background: "rgba(15, 12, 35, 0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          gap: 14,
          alignItems: "start",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(124,58,237,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <img src={lawyer.avatar} alt={lawyer.name}
          style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />

        <div style={{ minWidth: 0 }}>
          {/* Name + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{lawyer.name}</h3>
            {lawyer.badge && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", padding: "2px 8px", borderRadius: 999, background: "rgba(139,92,246,0.12)", whiteSpace: "nowrap" }}>
                ✦ {lawyer.badge}
              </span>
            )}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#8b5cf6", fontWeight: 600 }}>
            {lawyer.title} · {lawyer.specialization}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <StarRating rating={lawyer.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>{lawyer.rating}</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>({lawyer.reviewCount})</span>
          </div>

          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {lawyer.bio}
          </p>

          {/* Stats + fee row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                { label: "Experience", value: `${lawyer.experience}yr` },
                { label: "Cases Won",  value: lawyer.casesWon },
                { label: "Success",    value: `${lawyer.successRate}%` },
              ].map((s) => (
                <div key={s.label}>
                  <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>${lawyer.fee}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>/hr</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const selectStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
  color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none", background:'black',
};

export default function BrowseLawyers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ specialization: "", availability: "", location: "", minRating: 0, maxFee: 9999 });

  const specializations = [...new Set(lawyersData.map((l) => l.specialization))];
  const locations       = [...new Set(lawyersData.map((l) => l.location))];
  const maxFee          = Math.max(...lawyersData.map((l) => l.fee));

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredLawyers = useMemo(() => {
    return lawyersData.filter((lawyer) => {
      const q = searchTerm.toLowerCase();
      return (
        (lawyer.name.toLowerCase().includes(q) || lawyer.bio.toLowerCase().includes(q) || lawyer.specialization.toLowerCase().includes(q)) &&
        (!filters.specialization || lawyer.specialization === filters.specialization) &&
        (!filters.availability   || lawyer.availability   === filters.availability) &&
        (!filters.location       || lawyer.location       === filters.location) &&
        lawyer.rating >= filters.minRating &&
        lawyer.fee    <= filters.maxFee
      );
    });
  }, [searchTerm, filters]);

  const resetFilters = () => setFilters({ specialization: "", availability: "", location: "", minRating: 0, maxFee });

  const filterPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Filters</h2>

      {[
        { label: "Specialization", key: "specialization", options: specializations },
        { label: "Location",       key: "location",       options: locations },
      ].map(({ label, key, options }) => (
        <div key={key}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
          <select value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })} style={selectStyle}>
            <option value="">All {label}s</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Availability</label>
        <select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })} style={selectStyle}>
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {/* <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Min Rating — <span style={{ color: "#f1f5f9" }}>{filters.minRating.toFixed(1)}★</span>
        </label>
        <input type="range" min="0" max="5" step="0.5" value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
          style={{ width: "100%", cursor: "pointer" }} />
      </div> */}

      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Max Fee/hr — <span style={{ color: "#f1f5f9" }}>${filters.maxFee}</span>
        </label>
        <input type="range" min="0" max={maxFee} step="50" value={filters.maxFee}
          onChange={(e) => setFilters({ ...filters, maxFee: parseInt(e.target.value) })}
          style={{ width: "100%", cursor: "pointer" }} />
      </div>

      <button
        onClick={resetFilters}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(124,58,237,0.35)", background: "rgba(124,58,237,0.12)", color: "#a78bfa", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.12)")}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)", padding: "32px 16px" }}>
      <style>{`
        @media (min-width: 640px)  { .bl-main { padding: 48px 24px !important; } }
        @media (min-width: 1024px) { .bl-main { padding: 48px 32px !important; } }

        /* layout: stacked on mobile, sidebar+content on lg */
        .bl-layout { display: flex; flex-direction: column; gap: 20; }
        @media (min-width: 1024px) {
          .bl-layout { display: grid !important; grid-template-columns: 280px 1fr; gap: 32px; }
        }

        /* sidebar: always visible on lg, toggle on mobile */
        .bl-sidebar-panel {
          border-radius: 20px;
          background: rgba(15, 12, 35, 0.95);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 20px;
        }
        @media (min-width: 1024px) {
          .bl-sidebar-panel { position: sticky; top: 24px; height: fit-content; }
          .bl-filter-toggle { display: none !important; }
          .bl-sidebar-collapsible { display: block !important; }
        }
        .bl-sidebar-collapsible { display: none; margin-top: 16px; }
        .bl-sidebar-collapsible.open { display: block; }
      `}</style>

      <div className="bl-main" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(1.6rem, 4vw, 3rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
            Browse Legal Experts
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "#94a3b8" }}>Find the perfect attorney for your case with advanced filters</p>
        </div>

        <div className="bl-layout">
          {/* Filters sidebar */}
          <aside>
            <div className="bl-sidebar-panel">
              {/* Mobile toggle header */}
              <button
                className="bl-filter-toggle"
                onClick={() => setShowFilters((v) => !v)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Filters</span>
                <span style={{ fontSize: 18, color: "#a78bfa", transition: "transform 0.2s", transform: showFilters ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              </button>

              {/* Filter content */}
              <div className={`bl-sidebar-collapsible${showFilters ? " open" : ""}`}>
                {filterPanel}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Search bar */}
            <div style={{ marginBottom: 20, position: "relative" }}>
              <input
                type="text"
                placeholder="Search by name, specialty, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "13px 16px 13px 42px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15, 12, 35, 0.95)", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";  e.currentTarget.style.boxShadow = "none"; }}
              />
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "#94a3b8" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            <div style={{ marginBottom: 16, fontSize: 14, color: "#94a3b8" }}>
              Found <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{filteredLawyers.length}</span>{" "}
              lawyer{filteredLawyers.length !== 1 ? "s" : ""}
            </div>

            {isLoading ? (
              <div style={{ display: "grid", gap: 14 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <LawyerCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredLawyers.length > 0 ? (
              <div style={{ display: "grid", gap: 14 }}>
                {filteredLawyers.map((lawyer) => <LawyerListCard key={lawyer.id} lawyer={lawyer} />)}
              </div>
            ) : (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No lawyers found</p>
                <p style={{ fontSize: 14 }}>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
