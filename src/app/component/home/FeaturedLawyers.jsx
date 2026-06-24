"use client";
import React, { useState, useEffect } from "react";
import FeaturedLawyerCard from "./FeaturedLawyerCard";
import { SkeletonCard } from "@/app/components/SkeletonLoader";

export default function FeaturedLawyers() {
  const [isLoading, setIsLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const fetchFeaturedLawyers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/lawyers');
        if (!response.ok) throw new Error('Failed to fetch lawyers');
        
        const data = await response.json();
        // Get first 6 lawyers as featured
        setLawyers(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured lawyers:', error);
        setLawyers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedLawyers();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        padding: "96px 24px",
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #0d0b1e 50%, #0a0a0f 100%)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "3%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {/* Section eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 999,
              border: "1px solid rgba(139,92,246,0.3)",
              background: "rgba(139,92,246,0.07)",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#a78bfa",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ⚖️ Our Legal Experts
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Meet Our{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Featured Lawyers
            </span>
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Handpicked top-rated attorneys across every legal domain — ready to
            fight for your rights.
          </p>
        </div>

        {/* Card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
            justifyItems: "center",
          }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : lawyers.length > 0 ? (
            lawyers.map((lawyer) => (
              <FeaturedLawyerCard key={lawyer.id} lawyer={lawyer} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
              <p style={{ fontSize: 16, margin: 0 }}>No featured lawyers available at the moment.</p>
            </div>
          )}
        </div>

        {/* View all CTA */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          {!isLoading && (
            <a
              href="/lawyers"
            id="view-all-lawyers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 36px",
              borderRadius: 12,
              border: "1px solid rgba(139,92,246,0.35)",
              background: "rgba(139,92,246,0.08)",
              color: "#a78bfa",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              transition: "all 0.25s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #7c3aed, #4f46e5)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(124,58,237,0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.08)";
              e.currentTarget.style.color = "#a78bfa";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Browse All Lawyers
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          )}
        </div>
      </div>
    </section>
  );
}
