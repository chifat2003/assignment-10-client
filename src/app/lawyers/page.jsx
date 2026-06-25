"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { LawyerCardSkeleton } from "@/app/components/SkeletonLoader";

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
                { label: "Cases Won", value: lawyer.casesWon },
                { label: "Success", value: `${lawyer.successRate}%` },
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

const ITEMS_PER_PAGE = 8;

export default function BrowseLawyers() {
  const [isLoading, setIsLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch lawyers from API on mount
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch('/api/lawyers');
        const data = await response.json();

        console.log('Fetched lawyers:', data);
        setLawyers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        setError(error.message);
        setLawyers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Filter lawyers based on search term
  const filteredLawyers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return lawyers.filter((lawyer) =>
      lawyer.name.toLowerCase().includes(q) ||
      lawyer.bio.toLowerCase().includes(q) ||
      lawyer.specialization.toLowerCase().includes(q)
    );
  }, [searchTerm, lawyers]);

  // Pagination
  const totalPages = Math.ceil(filteredLawyers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLawyers = filteredLawyers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)", padding: "32px 16px" }}>
      <style>{`
        @media (min-width: 640px)  { .bl-main { padding: 48px 24px !important; } }
        @media (min-width: 1024px) { .bl-main { padding: 48px 32px !important; } }
      `}</style>

      <div className="bl-main" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(1.6rem, 4vw, 3rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
            Browse Legal Experts
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "#94a3b8" }}>Find the perfect attorney for your case</p>
        </div>

        {/* Search bar */}
        <div style={{ marginBottom: 28, position: "relative" }}>
          <input
            type="text"
            placeholder="Search by name, specialty, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "13px 16px 13px 42px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15, 12, 35, 0.95)", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "#94a3b8" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Error: {error}</p>
            <p style={{ margin: '8px 0 0', fontSize: 12 }}>Make sure your backend API is running and accessible</p>
          </div>
        )}

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
        ) : paginatedLawyers.length > 0 ? (
          <>
            <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
              {paginatedLawyers.map((lawyer) => <LawyerListCard key={lawyer.id} lawyer={lawyer} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: currentPage === 1 ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.1)",
                    color: currentPage === 1 ? "#475569" : "#818cf8",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        border: page === currentPage ? "1px solid #6366f1" : "1px solid rgba(99,102,241,0.2)",
                        background: page === currentPage ? "rgba(99,102,241,0.2)" : "transparent",
                        color: page === currentPage ? "#818cf8" : "#64748b",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: currentPage === totalPages ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.1)",
                    color: currentPage === totalPages ? "#475569" : "#818cf8",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No lawyers found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </main>
  );
}
