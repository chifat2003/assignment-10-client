"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

const STATS = [
  { value: "10K+", label: "Cases Resolved" },
  { value: "500+", label: "Expert Lawyers" },
  { value: "98%", label: "Success Rate" },
  { value: "24/7", label: "Support Available" },
];

const BADGES = ["Contract Law", "Criminal Defense", "Family Law", "Corporate", "IP Rights"];

const Herohome = () => {
  const canvasRef = useRef(null);

  /* ── Particle background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });

      /* connect nearby particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 50%, #0a0f1e 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Glow blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "15%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "10%",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* ── Main content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 860, width: "100%",
        margin: "0 auto", padding: "80px 24px",
        textAlign: "center",
      }}>

        {/* Trust badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 999,
          border: "1px solid rgba(139,92,246,0.35)",
          background: "rgba(139,92,246,0.08)",
          marginBottom: 32,
          animation: "fadeSlideDown 0.6s ease both",
        }}>
          <span style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600 }}>
            ⚖️ Trusted Legal Partner Since 2018
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          marginBottom: 24,
          animation: "fadeSlideDown 0.7s ease 0.1s both",
        }}>
          Justice Made{" "}
          <span style={{
            background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Simple
          </span>
          {" "}for Everyone
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
          color: "#94a3b8",
          lineHeight: 1.75,
          maxWidth: 620,
          margin: "0 auto 40px",
          animation: "fadeSlideDown 0.7s ease 0.2s both",
        }}>
          Connect with top-rated attorneys, manage your cases online, and get expert
          legal advice — all in one place, available around the clock.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 16, justifyContent: "center",
          marginBottom: 48,
          animation: "fadeSlideDown 0.7s ease 0.3s both",
        }}>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff", fontWeight: 700, fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 0 30px rgba(124,58,237,0.4)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link href="/services" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.04)",
            color: "#e2e8f0", fontWeight: 600, fontSize: 16,
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Watch How It Works
          </Link>
        </div>

        {/* Practice area badges */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 10, justifyContent: "center",
          marginBottom: 64,
          animation: "fadeSlideDown 0.7s ease 0.4s both",
        }}>
          {BADGES.map((b) => (
            <span key={b} style={{
              padding: "5px 14px", borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(255,255,255,0.03)",
              color: "#94a3b8", fontSize: 13, fontWeight: 500,
            }}>
              {b}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.1)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
          animation: "fadeSlideDown 0.7s ease 0.5s both",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: "28px 16px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(148,163,184,0.08)" : "none",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.1,
                marginBottom: 6,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{
          marginTop: 40,
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 12,
          animation: "fadeSlideDown 0.7s ease 0.6s both",
        }}>
          <div style={{ display: "flex" }}>
            {["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: "50%",
                background: c, border: "2px solid #0a0a0f",
                marginLeft: i === 0 ? 0 : -8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>
                {["A", "B", "C", "D", "E"][i]}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              Trusted by <strong style={{ color: "#94a3b8" }}>10,000+</strong> clients
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Herohome;