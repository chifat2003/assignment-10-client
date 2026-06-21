// "use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Availability badge config ── */
const AVAILABILITY_CONFIG = {
  Available: { color: "#10b981", bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  Busy: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  Unavailable: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", dot: "#ef4444" },
};

/* ── Specialization gradient map ── */
const SPEC_GRADIENTS = {
  "Corporate Law": "linear-gradient(135deg, #4f46e5, #7c3aed)",
  "Criminal Law": "linear-gradient(135deg, #dc2626, #9f1239)",
  "Family Law": "linear-gradient(135deg, #0ea5e9, #7c3aed)",
  "Civil Litigation": "linear-gradient(135deg, #0d9488, #0ea5e9)",
  "Intellectual Property": "linear-gradient(135deg, #f59e0b, #ef4444)",
  "Immigration Law": "linear-gradient(135deg, #10b981, #0ea5e9)",
};

/* ── Star rating component ── */
function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={filled || half ? "#f59e0b" : "none"}
            stroke="#f59e0b"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   Featured Lawyer Card
══════════════════════════════════════════ */
export default function FeaturedLawyerCard({ lawyer }) {
  const [hovered, setHovered] = useState(false);

  const {
    id,
    name,
    title,
    specialization,
    avatar,
    rating,
    reviewCount,
    experience,
    casesWon,
    location,
    languages,
    fee,
    availability,
    badge,
    tags,
    bio,
    successRate,
  } = lawyer;

  const avail = AVAILABILITY_CONFIG[availability] ?? AVAILABILITY_CONFIG["Available"];
  const accentGradient = SPEC_GRADIENTS[specialization] ?? "linear-gradient(135deg, #7c3aed, #4f46e5)";

  return (
    <article
      id={`lawyer-card-${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        background: "linear-gradient(160deg, rgba(15,12,35,0.97) 0%, rgba(10,10,25,0.97) 100%)",
        border: hovered
          ? "1px solid rgba(139,92,246,0.5)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflow: "hidden",
        maxWidth: 380,
        width: "100%",
        cursor: "default",
      }}
    >
      {/* ── Top accent stripe ── */}
      <div
        style={{
          height: 4,
          background: accentGradient,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Card body ── */}
      <div style={{ padding: "24px 24px 20px" }}>

        {/* ── Top row: avatar + badge + availability ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>

          {/* Avatar with ring */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: accentGradient,
                padding: 2,
                transition: "transform 0.3s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#1a1a2e",
                }}
              >
                <img
                  src={avatar}
                  alt={name}
                  width={64}
                  height={64}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Online indicator */}
            {availability === "Available" && (
              <span
                style={{
                  position: "absolute",
                  bottom: 3,
                  right: 3,
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "2px solid #0a0a1a",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
            )}
          </div>

          {/* Right: badge + availability */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            {/* Badge */}
            {badge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: accentGradient,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                ✦ {badge}
              </span>
            )}

            {/* Availability pill */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 999,
                background: avail.bg,
                border: `1px solid ${avail.color}33`,
                fontSize: 11,
                fontWeight: 600,
                color: avail.color,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: avail.dot,
                  boxShadow: `0 0 5px ${avail.dot}`,
                  animation: availability === "Available" ? "pulse 2s infinite" : "none",
                }}
              />
              {availability}
            </span>
          </div>
        </div>

        {/* ── Name & title ── */}
        <div style={{ marginBottom: 6 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 19,
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "#7c3aed",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            {title} · {specialization}
          </p>
        </div>

        {/* ── Rating & reviews ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <StarRating rating={rating} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#f59e0b",
            }}
          >
            {rating}
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            ({reviewCount} reviews)
          </span>
        </div>

        {/* ── Bio ── */}
        {/* <p
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "#94a3b8",
            lineHeight: 1.65,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {bio}
        </p> */}

        {/* ── Stats row ── */}
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            borderRadius: 12,
            overflow: "hidden",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 16,
          }}
        >
          {[
            { label: "Experience", value: `${experience}yr` },
            { label: "Cases Won", value: casesWon },
            { label: "Success", value: `${successRate}%` },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "12px 8px",
                textAlign: "center",
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  background: accentGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 10.5, color: "#475569", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}

        {/* ── Tags ── */}
        {/* <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 18,
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                borderRadius: 999,
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.18)",
                fontSize: 11,
                color: "#a78bfa",
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div> */}

        {/* ── Location & language ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {languages.join(", ")}
          </span>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 18,
          }}
        />

        {/* ── Footer: fee + CTA ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Fee */}
          <div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              ${fee}
            </span>
            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>
              / hr
            </span>
          </div>

          {/* CTA button */}
          <Link
            href={`/lawyers/${id}`}
            id={`book-lawyer-${id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              borderRadius: 10,
              background: hovered
                ? accentGradient
                : "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
              color: hovered ? "#fff" : "#a78bfa",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
              transition: "all 0.25s ease",
              boxShadow: hovered
                ? "0 8px 24px rgba(124,58,237,0.4)"
                : "none",
            }}
          >
            Book Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </article>
  );
}
