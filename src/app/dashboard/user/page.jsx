"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

/* ─────────────────────── helpers ─────────────────────────── */
function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  const wks = Math.floor(days / 7);
  if (wks < 5) return `${wks}w ago`;
  return formatDate(iso);
}

/* derive status badge colour */
const STATUS_STYLE = {
  pending:  { bg: "rgba(234,179,8,0.14)",  color: "#facc15", dot: "#eab308" },
  accepted: { bg: "rgba(34,197,94,0.14)",  color: "#4ade80", dot: "#22c55e" },
  rejected: { bg: "rgba(239,68,68,0.14)",  color: "#f87171", dot: "#ef4444" },
};

/* ─────────────────────── component ───────────────────────── */
export default function UserDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [hirings,   setHirings]   = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [authReady,   setAuthReady]   = useState(false);

  /* ── auth guard ── */
  useEffect(() => {
    if (isPending) return;
    if (!session) { router.replace("/signin"); return; }
    if (session.user?.role === "lawyer") { router.replace("/dashboard/lawyer"); return; }
    if (session.user?.role === "admin")  { router.replace("/dashboard/admin");  return; }
    setAuthReady(true);
  }, [isPending, session, router]);

  /* ── fetch hirings ── */
  const fetchHirings = useCallback(async () => {
    try {
      setDataLoading(true);
      const res = await fetch("/api/hirings");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setHirings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching hirings:", e);
      setHirings([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) fetchHirings();
  }, [authReady, fetchHirings]);

  if (isPending || !authReady) return <LoadingSpinner size="lg" />;

  /* ── derive stats ── */
  const totalHirings    = hirings.length;
  const pendingCount    = hirings.filter((h) => h.status === "pending").length;
  const acceptedCount   = hirings.filter((h) => h.status === "accepted").length;
  const paidCount       = hirings.filter((h) => h.paymentStatus === "paid").length;

  /* ── derive activity feed (latest 5) ── */
  const activity = hirings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((h) => {
      const s = STATUS_STYLE[h.status] || STATUS_STYLE.pending;
      let icon = "⚖️";
      let text = `Sent a hiring request to ${h.lawyerName}`;
      if (h.status === "accepted" && h.paymentStatus === "paid") {
        icon = "✅"; text = `Completed & paid consultation with ${h.lawyerName}`;
      } else if (h.status === "accepted") {
        icon = "🎉"; text = `${h.lawyerName} accepted your hiring request`;
      } else if (h.status === "rejected") {
        icon = "❌"; text = `${h.lawyerName} declined your hiring request`;
      }
      return { id: h.id, icon, text, date: h.createdAt, status: h.status, s, lawyerName: h.lawyerName, specialization: h.specialization };
    });

  const user        = session?.user;
  const avatarSrc   = user?.image || null;
  const initials    = getInitials(user?.name);
  const memberSince = formatDate(user?.createdAt);

  return (
    <div>
      <style>{`
        @keyframes ud-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ud-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }

        .ud-page { padding: 16px; display: flex; flex-direction: column; gap: 20px; animation: ud-fadein 0.35s ease; }
        @media (min-width: 640px) { .ud-page { padding: 24px; gap: 24px; } }

        /* ── Profile card ── */
        .ud-profile-card {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 20px;
          display: flex; flex-direction: column; gap: 16px;
        }
        @media (min-width: 540px) { .ud-profile-card { flex-direction: row; align-items: center; gap: 20px; padding: 24px; } }

        .ud-avatar {
          width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(99,102,241,0.4);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
          overflow: hidden;
        }
        .ud-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .ud-avatar .initials { color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -1px; }

        .ud-profile-info { flex: 1; min-width: 0; }
        .ud-profile-info h1 { margin: 0 0 3px; font-size: 20px; font-weight: 800; color: #f8fafc; letter-spacing: -0.3px; }
        .ud-profile-info .ud-email { margin: 0 0 8px; font-size: 13px; color: #64748b; }
        .ud-profile-info .ud-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

        .ud-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600;
          background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.25);
        }
        .ud-since { font-size: 12px; color: #475569; }

        /* ── update profile button ── */
        .ud-edit-btn {
          padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; text-decoration: none; white-space: nowrap;
          flex-shrink: 0; display: inline-block;
          transition: opacity 0.2s, transform 0.15s;
        }
        .ud-edit-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Stats grid ── */
        .ud-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .ud-stats { grid-template-columns: repeat(4, 1fr); } }

        .ud-stat-card {
          padding: 16px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
          display: flex; flex-direction: column; gap: 6px;
        }
        .ud-stat-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .ud-stat-value { font-size: 28px; font-weight: 800; color: #f8fafc; letter-spacing: -1px; line-height: 1; }
        .ud-stat-sub   { font-size: 11px; color: #475569; margin-top: 2px; }

        /* stat card accents */
        .ud-stat-card.accent-purple { border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.06); }
        .ud-stat-card.accent-yellow { border-color: rgba(234,179,8,0.2);  background: rgba(234,179,8,0.05);  }
        .ud-stat-card.accent-green  { border-color: rgba(34,197,94,0.2);  background: rgba(34,197,94,0.05);  }
        .ud-stat-card.accent-indigo { border-color: rgba(139,92,246,0.2); background: rgba(139,92,246,0.05); }
        .accent-purple .ud-stat-value { color: #818cf8; }
        .accent-yellow .ud-stat-value { color: #facc15; }
        .accent-green  .ud-stat-value { color: #4ade80; }
        .accent-indigo .ud-stat-value { color: #a78bfa; }

        /* skeleton pulse */
        .ud-skel { border-radius: 10px; background: rgba(255,255,255,0.05); animation: ud-pulse 1.8s ease infinite; }

        /* ── Activity feed ── */
        .ud-section-title {
          font-size: 11px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 14px;
        }
        .ud-activity-list { display: flex; flex-direction: column; gap: 10px; }
        .ud-activity-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: background 0.15s;
        }
        .ud-activity-item:hover { background: rgba(255,255,255,0.04); }
        .ud-activity-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
        }
        .ud-activity-body { flex: 1; min-width: 0; }
        .ud-activity-text { margin: 0 0 4px; font-size: 13px; color: #e2e8f0; font-weight: 500; line-height: 1.4; }
        .ud-activity-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ud-activity-date { font-size: 11px; color: #475569; }
        .ud-status-pill {
          padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600;
        }

        /* ── Quick links ── */
        .ud-quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 480px) { .ud-quick-links { grid-template-columns: repeat(3, 1fr); } }
        .ud-quick-link {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px 10px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02);
          text-decoration: none; color: #94a3b8; font-size: 12px; font-weight: 600;
          transition: all 0.2s; text-align: center;
        }
        .ud-quick-link:hover { background: rgba(255,255,255,0.06); color: #f1f5f9; border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }
        .ud-quick-link .ql-icon { font-size: 22px; }
      `}</style>

      <div className="ud-page">

        {/* ── Profile Card ── */}
        <div className="ud-profile-card">
          <div className="ud-avatar">
            {avatarSrc
              ? <img src={avatarSrc} alt={user?.name} />
              : <span className="initials">{initials}</span>
            }
          </div>
          <div className="ud-profile-info">
            <h1>{user?.name || "User"}</h1>
            <p className="ud-email">{user?.email || ""}</p>
            <div className="ud-meta">
              <span className="ud-badge">👤 User</span>
              {memberSince !== "—" && (
                <span className="ud-since">Member since {memberSince}</span>
              )}
            </div>
          </div>
          <Link href="/dashboard/user/update-profile" className="ud-edit-btn">
            ✏️ Edit Profile
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="ud-stats">
          {dataLoading ? (
            <>
              {[1,2,3,4].map(i => (
                <div key={i} className="ud-stat-card">
                  <div className="ud-skel" style={{ height: 12, width: "55%", marginBottom: 4 }} />
                  <div className="ud-skel" style={{ height: 32, width: "45%" }} />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="ud-stat-card accent-purple">
                <span className="ud-stat-label">Total Hirings</span>
                <span className="ud-stat-value">{totalHirings}</span>
                <span className="ud-stat-sub">All time requests</span>
              </div>
              <div className="ud-stat-card accent-yellow">
                <span className="ud-stat-label">Pending</span>
                <span className="ud-stat-value">{pendingCount}</span>
                <span className="ud-stat-sub">Awaiting response</span>
              </div>
              <div className="ud-stat-card accent-green">
                <span className="ud-stat-label">Accepted</span>
                <span className="ud-stat-value">{acceptedCount}</span>
                <span className="ud-stat-sub">Active engagements</span>
              </div>
              <div className="ud-stat-card accent-indigo">
                <span className="ud-stat-label">Completed</span>
                <span className="ud-stat-value">{paidCount}</span>
                <span className="ud-stat-sub">Paid consultations</span>
              </div>
            </>
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: 18 }}>
          <p className="ud-section-title">Recent Activity</p>

          {dataLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0" }}>
                  <div className="ud-skel" style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="ud-skel" style={{ height: 13, width: "80%" }} />
                    <div className="ud-skel" style={{ height: 10, width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ fontSize: 32, margin: "0 0 10px" }}>⚖️</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#64748b" }}>No activity yet</p>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#475569" }}>
                Browse lawyers and send your first hiring request.
              </p>
              <Link
                href="/lawyers"
                style={{ display: "inline-block", marginTop: 14, padding: "8px 20px", borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              >
                Browse Lawyers
              </Link>
            </div>
          ) : (
            <div className="ud-activity-list">
              {activity.map((item) => (
                <div key={item.id} className="ud-activity-item">
                  <div className="ud-activity-icon">{item.icon}</div>
                  <div className="ud-activity-body">
                    <p className="ud-activity-text">{item.text}</p>
                    <div className="ud-activity-meta">
                      <span className="ud-activity-date">{relativeDate(item.date)}</span>
                      {item.specialization && (
                        <span style={{ fontSize: 11, color: "#475569" }}>· {item.specialization}</span>
                      )}
                      <span
                        className="ud-status-pill"
                        style={{ background: item.s.bg, color: item.s.color }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {hirings.length > 5 && (
                <Link
                  href="/dashboard/user/hiring-history"
                  style={{ display: "block", textAlign: "center", padding: "10px 0", fontSize: 13, color: "#818cf8", fontWeight: 600, textDecoration: "none", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}
                >
                  View all {hirings.length} hirings →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ── Quick Links ── */}
        <div>
          <p className="ud-section-title">Quick Actions</p>
          <div className="ud-quick-links">
            <Link href="/lawyers" className="ud-quick-link">
              <span className="ql-icon">🔍</span>Find a Lawyer
            </Link>
            <Link href="/dashboard/user/hiring-history" className="ud-quick-link">
              <span className="ql-icon">📋</span>Hiring History
            </Link>
            <Link href="/dashboard/user/comments" className="ud-quick-link">
              <span className="ql-icon">💬</span>My Comments
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}