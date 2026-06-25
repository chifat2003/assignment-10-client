"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

const STATUS_STYLE = {
  pending:  { bg: "rgba(234,179,8,0.14)",  color: "#facc15" },
  accepted: { bg: "rgba(34,197,94,0.14)",  color: "#4ade80" },
  rejected: { bg: "rgba(239,68,68,0.14)",  color: "#f87171" },
};

/* ─────────────────────── component ───────────────────────── */
export default function LawyerDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [hirings,     setHirings]     = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* ── auth guard + fetch ── */
  useEffect(() => {
    if (isPending) return;
    if (!session)                          { router.replace("/signin");          return; }
    if (session.user?.role === "user")     { router.replace("/dashboard/user");  return; }
    if (session.user?.role === "admin")    { router.replace("/dashboard/admin"); return; }

    let cancelled = false;
    setDataLoading(true);

    fetch("/api/hirings")
      .then((res) => (res.ok ? res.json() : Promise.reject("fetch failed")))
      .then((data) => { if (!cancelled) setHirings(Array.isArray(data) ? data : []); })
      .catch((e) => { console.error("Error fetching hirings:", e); if (!cancelled) setHirings([]); })
      .finally(() => { if (!cancelled) setDataLoading(false); });

    return () => { cancelled = true; };
  }, [isPending, session, router]);

  if (isPending) return <LoadingSpinner size="lg" />;

  /* ── derived stats ── */
  const totalRequests = hirings.length;
  const pendingCount  = hirings.filter((h) => h.status === "pending").length;
  const acceptedCount = hirings.filter((h) => h.status === "accepted").length;
  const paidCount     = hirings.filter((h) => h.paymentStatus === "paid").length;

  /* ── activity feed (latest 5) ── */
  const activity = hirings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((h) => {
      const s = STATUS_STYLE[h.status] || STATUS_STYLE.pending;
      let icon = "📋";
      let text = `New hiring request from ${h.userName || "a client"}`;
      if (h.status === "accepted" && h.paymentStatus === "paid") {
        icon = "💰"; text = `${h.userName || "Client"} completed payment for your consultation`;
      } else if (h.status === "accepted") {
        icon = "✅"; text = `You accepted a request from ${h.userName || "a client"}`;
      } else if (h.status === "rejected") {
        icon = "❌"; text = `You declined a request from ${h.userName || "a client"}`;
      }
      return { id: h.id, icon, text, date: h.createdAt, status: h.status, s,
               service: h.serviceName || h.specialization, fee: h.fee };
    });

  const user       = session?.user;
  const avatarSrc  = user?.image || null;
  const initials   = getInitials(user?.name);
  const memberSince = formatDate(user?.createdAt);

  /* ── availability badge colour ── */
  const availColor = user?.availability === "Available"
    ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(34,197,94,0.3)" }
    : { bg: "rgba(234,179,8,0.15)",  color: "#facc15", border: "rgba(234,179,8,0.3)" };

  return (
    <div>
      <style>{`
        @keyframes ld-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ld-pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }

        .ld-page { padding: 16px; display: flex; flex-direction: column; gap: 20px; animation: ld-fadein 0.35s ease; }
        @media (min-width: 640px) { .ld-page { padding: 24px; gap: 24px; } }

        /* ── Profile hero ── */
        .ld-hero {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 20px;
          position: relative; overflow: hidden;
        }
        .ld-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
        }
        .ld-hero-inner { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 600px) { .ld-hero-inner { flex-direction: row; align-items: flex-start; gap: 20px; } }

        .ld-avatar {
          width: 88px; height: 88px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(99,102,241,0.5);
          box-shadow: 0 0 0 5px rgba(99,102,241,0.1);
          overflow: hidden;
        }
        .ld-avatar img   { width: 100%; height: 100%; object-fit: cover; }
        .ld-avatar .init { color: #fff; font-size: 30px; font-weight: 800; letter-spacing: -1px; }

        .ld-hero-body { flex: 1; min-width: 0; }
        .ld-hero-name { margin: 0 0 2px; font-size: 22px; font-weight: 800; color: #f8fafc; letter-spacing: -0.4px; }
        .ld-hero-title { margin: 0 0 10px; font-size: 13px; color: #818cf8; font-weight: 600; }
        .ld-hero-email { margin: 0 0 10px; font-size: 13px; color: #64748b; }
        .ld-hero-tags  { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }

        .ld-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: #94a3b8;
        }
        .ld-tag.avail { border-color: var(--avail-border); background: var(--avail-bg); color: var(--avail-color); }
        .ld-tag.role  { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.12); color: #818cf8; }

        .ld-hero-actions { display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap; margin-top: 4px; }
        @media (min-width: 600px) { .ld-hero-actions { align-self: flex-start; } }

        .ld-btn-primary {
          padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; text-decoration: none; white-space: nowrap;
          display: inline-block; border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .ld-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        .ld-btn-ghost {
          padding: 9px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; text-decoration: none; white-space: nowrap;
          display: inline-block; transition: all 0.2s;
        }
        .ld-btn-ghost:hover { background: rgba(255,255,255,0.09); color: #f1f5f9; }

        /* ── Professional info strip ── */
        .ld-info-strip {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          padding-top: 16px; margin-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 640px) { .ld-info-strip { grid-template-columns: repeat(4, 1fr); } }

        .ld-info-cell { display: flex; flex-direction: column; gap: 3px; }
        .ld-info-label { font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .ld-info-val   { font-size: 14px; font-weight: 600; color: #e2e8f0; }

        /* ── Stats ── */
        .ld-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .ld-stats { grid-template-columns: repeat(4, 1fr); } }

        .ld-stat {
          padding: 16px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
          display: flex; flex-direction: column; gap: 5px;
        }
        .ld-stat.a-purple { border-color: rgba(99,102,241,0.2);  background: rgba(99,102,241,0.06); }
        .ld-stat.a-yellow { border-color: rgba(234,179,8,0.2);   background: rgba(234,179,8,0.05); }
        .ld-stat.a-green  { border-color: rgba(34,197,94,0.2);   background: rgba(34,197,94,0.05); }
        .ld-stat.a-amber  { border-color: rgba(251,191,36,0.2);  background: rgba(251,191,36,0.05); }

        .ld-stat-lbl { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .ld-stat-val { font-size: 28px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
        .ld-stat-sub { font-size: 11px; color: #475569; margin-top: 1px; }
        .a-purple .ld-stat-val { color: #818cf8; }
        .a-yellow .ld-stat-val { color: #facc15; }
        .a-green  .ld-stat-val { color: #4ade80; }
        .a-amber  .ld-stat-val { color: #fbbf24; }

        /* skeleton */
        .ld-skel { border-radius: 8px; background: rgba(255,255,255,0.05); animation: ld-pulse 1.8s ease infinite; }

        /* ── Activity ── */
        .ld-section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 14px; }

        .ld-activity-list { display: flex; flex-direction: column; gap: 10px; }
        .ld-activity-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: background 0.15s;
        }
        .ld-activity-item:hover { background: rgba(255,255,255,0.04); }
        .ld-act-icon {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
        }
        .ld-act-body { flex: 1; min-width: 0; }
        .ld-act-text { margin: 0 0 5px; font-size: 13px; color: #e2e8f0; font-weight: 500; line-height: 1.4; }
        .ld-act-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .ld-act-date { font-size: 11px; color: #475569; }
        .ld-status-pill { padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; }
        .ld-act-fee  { font-size: 11px; color: #475569; }

        /* ── Quick links ── */
        .ld-quick { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 480px) { .ld-quick { grid-template-columns: repeat(3, 1fr); } }
        .ld-quick-link {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px 10px; border-radius: 12px; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02);
          color: #94a3b8; font-size: 12px; font-weight: 600;
          transition: all 0.2s; text-align: center;
        }
        .ld-quick-link:hover { background: rgba(255,255,255,0.06); color: #f1f5f9; border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }
        .ld-quick-link .qi { font-size: 22px; }
      `}</style>

      <div className="ld-page">

        {/* ── Profile Hero ── */}
        <div className="ld-hero">
          <div className="ld-hero-inner">

            {/* Avatar */}
            <div className="ld-avatar">
              {avatarSrc
                ? <Image src={avatarSrc} alt={user?.name || "avatar"} width={88} height={88} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span className="init">{initials}</span>
              }
            </div>

            {/* Info */}
            <div className="ld-hero-body">
              <h1 className="ld-hero-name">{user?.name || "Lawyer"}</h1>
              {user?.title && <p className="ld-hero-title">{user.title}</p>}
              <p className="ld-hero-email">{user?.email}</p>
              <div className="ld-hero-tags">
                <span className="ld-tag role">⚖️ Lawyer</span>
                {user?.specialization && (
                  <span className="ld-tag">📌 {user.specialization}</span>
                )}
                {user?.availability && (
                  <span
                    className="ld-tag avail"
                    style={{
                      "--avail-bg":     availColor.bg,
                      "--avail-color":  availColor.color,
                      "--avail-border": availColor.border,
                    }}
                  >
                    {user.availability === "Available" ? "🟢" : "🟡"} {user.availability}
                  </span>
                )}
                {user?.badge && <span className="ld-tag">🏅 {user.badge}</span>}
                {memberSince !== "—" && (
                  <span className="ld-tag">📅 Since {memberSince}</span>
                )}
              </div>

              {/* Professional info strip */}
              {(user?.specialization || user?.location || user?.experience || user?.rating) && (
                <div className="ld-info-strip">
                  {user?.rating > 0 && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Rating</span>
                      <span className="ld-info-val" style={{ color: "#fbbf24" }}>⭐ {Number(user.rating).toFixed(1)} / 5</span>
                    </div>
                  )}
                  {user?.experience > 0 && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Experience</span>
                      <span className="ld-info-val">{user.experience}+ yrs</span>
                    </div>
                  )}
                  {user?.caseWon > 0 && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Cases Won</span>
                      <span className="ld-info-val" style={{ color: "#4ade80" }}>{user.caseWon}</span>
                    </div>
                  )}
                  {user?.successRate > 0 && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Success Rate</span>
                      <span className="ld-info-val" style={{ color: "#818cf8" }}>{user.successRate}%</span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Location</span>
                      <span className="ld-info-val">📍 {user.location}</span>
                    </div>
                  )}
                  {user?.reviewCount > 0 && (
                    <div className="ld-info-cell">
                      <span className="ld-info-label">Reviews</span>
                      <span className="ld-info-val">{user.reviewCount}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bio */}
              {user?.bio && (
                <p style={{ margin: "14px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
                  {user.bio}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="ld-hero-actions">
              <Link href="/dashboard/lawyer/update-profile" className="ld-btn-primary">
                ✏️ Edit Profile
              </Link>
              <Link href="/dashboard/lawyer/manage-legal-profile" className="ld-btn-ghost">
                ⚙️ Services
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="ld-stats">
          {dataLoading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="ld-stat">
                <div className="ld-skel" style={{ height: 11, width: "55%", marginBottom: 4 }} />
                <div className="ld-skel" style={{ height: 30, width: "40%" }} />
              </div>
            ))
          ) : (
            <>
              <div className="ld-stat a-purple">
                <span className="ld-stat-lbl">Total Requests</span>
                <span className="ld-stat-val">{totalRequests}</span>
                <span className="ld-stat-sub">All incoming hirings</span>
              </div>
              <div className="ld-stat a-yellow">
                <span className="ld-stat-lbl">Pending</span>
                <span className="ld-stat-val">{pendingCount}</span>
                <span className="ld-stat-sub">Awaiting action</span>
              </div>
              <div className="ld-stat a-green">
                <span className="ld-stat-lbl">Accepted</span>
                <span className="ld-stat-val">{acceptedCount}</span>
                <span className="ld-stat-sub">Active clients</span>
              </div>
              <div className="ld-stat a-amber">
                <span className="ld-stat-lbl">Paid</span>
                <span className="ld-stat-val">{paidCount}</span>
                <span className="ld-stat-sub">Completed & paid</span>
              </div>
            </>
          )}
        </div>

        {/* ── Activity Feed ── */}
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: 18 }}>
          <p className="ld-section-title">Recent Activity</p>

          {dataLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0" }}>
                  <div className="ld-skel" style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="ld-skel" style={{ height: 13, width: "75%" }} />
                    <div className="ld-skel" style={{ height: 10, width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ fontSize: 32, margin: "0 0 10px" }}>📭</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#64748b" }}>No requests yet</p>
              <p style={{ margin: "6px 0 14px", fontSize: 13, color: "#475569" }}>
                Add your services to start receiving client requests.
              </p>
              <Link
                href="/dashboard/lawyer/manage-legal-profile"
                style={{ display: "inline-block", padding: "8px 20px", borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              >
                Add Services
              </Link>
            </div>
          ) : (
            <div className="ld-activity-list">
              {activity.map((item) => (
                <div key={item.id} className="ld-activity-item">
                  <div className="ld-act-icon">{item.icon}</div>
                  <div className="ld-act-body">
                    <p className="ld-act-text">{item.text}</p>
                    <div className="ld-act-meta">
                      <span className="ld-act-date">{relativeDate(item.date)}</span>
                      {item.service && <span className="ld-act-fee">· {item.service}</span>}
                      {item.fee   && <span className="ld-act-fee">· ${item.fee}/hr</span>}
                      <span
                        className="ld-status-pill"
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
                  href="/dashboard/lawyer/hiring-history"
                  style={{ display: "block", textAlign: "center", padding: "10px 0", fontSize: 13, color: "#818cf8", fontWeight: 600, textDecoration: "none", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}
                >
                  View all {hirings.length} requests →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <p className="ld-section-title">Quick Actions</p>
          <div className="ld-quick">
            <Link href="/dashboard/lawyer/hiring-history" className="ld-quick-link">
              <span className="qi">📋</span>Hiring Requests
            </Link>
            <Link href="/dashboard/lawyer/manage-legal-profile" className="ld-quick-link">
              <span className="qi">⚙️</span>Manage Services
            </Link>
            <Link href="/dashboard/lawyer/update-profile" className="ld-quick-link">
              <span className="qi">✏️</span>Update Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
