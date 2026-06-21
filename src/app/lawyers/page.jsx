"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import lawyersData from "@/app/data/lawyers.json";

/* Star rating component */
function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={rating >= star ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* Lawyer list card component */
function LawyerListCard({ lawyer }) {
  return (
    <Link href={`/lawyers/${lawyer.id}`}>
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "rgba(15, 12, 35, 0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          gap: 20,
          alignItems: "start",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
          e.currentTarget.style.background = "rgba(20, 18, 48, 0.95)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 12px 32px rgba(124,58,237,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.background = "rgba(15, 12, 35, 0.95)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <img
          src={lawyer.avatar}
          alt={lawyer.name}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            objectFit: "cover",
          }}
        />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              {lawyer.name}
            </h3>
            {lawyer.badge && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#a78bfa",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(139,92,246,0.12)",
                }}
              >
                ✦ {lawyer.badge}
              </span>
            )}
          </div>

          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              color: "#8b5cf6",
              fontWeight: 600,
            }}
          >
            {lawyer.title} · {lawyer.specialization}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <StarRating rating={lawyer.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>
              {lawyer.rating}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              ({lawyer.reviewCount} reviews)
            </span>
          </div>

          <p
            style={{
              margin: "0 0 12px",
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {lawyer.bio}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  Experience
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>
                  {lawyer.experience}yr
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  Cases Won
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>
                  {lawyer.casesWon}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  Success
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>
                  {lawyer.successRate}%
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>
                ${lawyer.fee}
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>/hr</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BrowseLawyers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialization: "",
    availability: "",
    location: "",
    minRating: 0,
    maxFee: 9999,
  });

  /* Extract unique values for filters */
  const specializations = [
    ...new Set(lawyersData.map((l) => l.specialization)),
  ];
  const locations = [...new Set(lawyersData.map((l) => l.location))];
  const maxFee = Math.max(...lawyersData.map((l) => l.fee));

  /* Filter and search lawyers */
  const filteredLawyers = useMemo(() => {
    return lawyersData.filter((lawyer) => {
      const matchesSearch =
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        !filters.specialization ||
        lawyer.specialization === filters.specialization;
      const matchesAvailability =
        !filters.availability || lawyer.availability === filters.availability;
      const matchesLocation =
        !filters.location || lawyer.location === filters.location;
      const matchesRating = lawyer.rating >= filters.minRating;
      const matchesFee = lawyer.fee <= filters.maxFee;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesAvailability &&
        matchesLocation &&
        matchesRating &&
        matchesFee
      );
    });
  }, [searchTerm, filters]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
            }}
          >
            Browse Legal Experts
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "#94a3b8" }}>
            Find the perfect attorney for your case with advanced filters
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32 }}>
          {/* Sidebar Filters */}
          <aside
            style={{
              borderRadius: 20,
              background: "rgba(15, 12, 35, 0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 24,
              height: "fit-content",
              position: "sticky",
              top: 24,
            }}
          >
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: 16,
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              Filters
            </h2>

            {/* Specialization Filter */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Specialization
              </label>
              <select
                value={filters.specialization}
                onChange={(e) =>
                  setFilters({ ...filters, specialization: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#f1f5f9",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) =>
                  setFilters({ ...filters, availability: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#f1f5f9",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Location Filter */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#f1f5f9",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating Filter */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Min Rating
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minRating: parseFloat(e.target.value),
                    })
                  }
                  style={{ flex: 1, cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f1f5f9",
                    minWidth: 30,
                  }}
                >
                  {filters.minRating.toFixed(1)}★
                </span>
              </div>
            </div>

            {/* Max Fee Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Max Fee/hr
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="range"
                  min="0"
                  max={maxFee}
                  step="50"
                  value={filters.maxFee}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxFee: parseInt(e.target.value),
                    })
                  }
                  style={{ flex: 1, cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f1f5f9",
                    minWidth: 50,
                  }}
                >
                  ${filters.maxFee}
                </span>
              </div>
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={() =>
                setFilters({
                  specialization: "",
                  availability: "",
                  location: "",
                  minRating: 0,
                  maxFee: maxFee,
                })
              }
              style={{
                width: "100%",
                marginTop: 24,
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(124,58,237,0.35)",
                background: "rgba(124,58,237,0.12)",
                color: "#a78bfa",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.12)";
              }}
            >
              Reset Filters
            </button>
          </aside>

          {/* Main Content */}
          <div>
            {/* Search Bar */}
            <div
              style={{
                marginBottom: 32,
                position: "relative",
              }}
            >
              <input
                type="text"
                placeholder="Search by name, specialty, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 42px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(15, 12, 35, 0.95)",
                  color: "#f1f5f9",
                  fontSize: 15,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(139,92,246,0.35)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(139,92,246,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 18,
                  height: 18,
                  color: "#94a3b8",
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Results Count */}
            <div
              style={{
                marginBottom: 20,
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              Found <span style={{ color: "#f1f5f9", fontWeight: 700 }}>
                {filteredLawyers.length}
              </span>{" "}
              lawyer{filteredLawyers.length !== 1 ? "s" : ""}
            </div>

            {/* Lawyers Grid */}
            {filteredLawyers.length > 0 ? (
              <div style={{ display: "grid", gap: 16 }}>
                {filteredLawyers.map((lawyer) => (
                  <LawyerListCard key={lawyer.id} lawyer={lawyer} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 60,
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  No lawyers found
                </p>
                <p style={{ fontSize: 14 }}>
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}