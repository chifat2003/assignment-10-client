import Link from "next/link";
import { notFound } from "next/navigation";
import lawyersData from "@/app/data/lawyers.json";

function findLawyer(id) {
  return lawyersData.find((lawyer) => lawyer.id === id);
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lawyer = findLawyer(resolvedParams.id);

  if (!lawyer) {
    return {
      title: "Lawyer Not Found",
      description: "The requested lawyer could not be found.",
    };
  }

  return {
    title: `${lawyer.name} | Lawyer Details`,
    description: `${lawyer.name} is a ${lawyer.specialization} expert with ${lawyer.experience} years of experience.`,
  };
}

export default async function LawyerDetailsPage({ params }) {
  const resolvedParams = await params;
  const lawyer = findLawyer(resolvedParams.id);
  if (!lawyer) {
    notFound();
  }

  const {
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

  const availabilityStyles = {
    Available: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    Busy: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    Unavailable: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  };

  const avail = availabilityStyles[availability] ?? availabilityStyles.Available;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)",
        padding: "48px 24px",
        color: "#e2e8f0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#a78bfa",
                marginBottom: 10,
              }}
            >
              Lawyer Profile
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              {name}
            </h1>
            <p style={{ margin: "16px 0 0", color: "#94a3b8", fontSize: 15, maxWidth: 760 }}>
              {title} specializing in {specialization}. {bio}
            </p>
          </div>

          <Link
            href="/lawyers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 20px",
              borderRadius: 14,
              border: "1px solid rgba(139,92,246,0.35)",
              background: "rgba(31,41,55,0.7)",
              color: "#c7d2fe",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Back to all lawyers
          </Link>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
            gap: 28,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              background: "rgba(15, 12, 35, 0.98)",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(124,58,237,0.35)",
                    background: "#11111a",
                  }}
                >
                  <img
                    src={avatar}
                    alt={`${name} avatar`}
                    width={100}
                    height={100}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(139,92,246,0.08)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#e0e7ff",
                      marginBottom: 10,
                    }}
                  >
                    {badge}
                  </span>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#8b5cf6",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {specialization}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {availability}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 18,
                }}
              >
                {[
                  { label: "Rating", value: `${rating} / 5` },
                  { label: "Reviews", value: `${reviewCount}` },
                  { label: "Success", value: `${successRate}%` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "18px 16px",
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#f8fafc",
                        marginBottom: 6,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Location</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
                      {location}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Languages</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
                      {languages.join(", ")}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "rgba(124,58,237,0.12)",
                        color: "#c4b5fd",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside
            style={{
              display: "grid",
              gap: 24,
            }}
          >
            <div
              style={{
                padding: 28,
                borderRadius: 24,
                background: "rgba(15, 12, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#8b5cf6",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 16,
                }}
              >
                Consultation Details
              </p>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: 12 }}>
                    Hourly fee
                  </span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9" }}>
                    ${fee} / hr
                  </span>
                </div>
                <div>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: 12 }}>
                    Experience
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>
                    {experience} years
                  </span>
                </div>
                <div>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: 12 }}>
                    Cases won
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>
                    {casesWon}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 28,
                borderRadius: 24,
                background: "rgba(15, 12, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                <div>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}>Availability</p>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: "#f8fafc" }}>
                    {availability}
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: avail.bg,
                    color: avail.color,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {availability}
                </span>
              </div>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
                Ready to start your case with a trusted advisor. Book a one-on-one consultation and get fast guidance from a top-rated attorney.
              </p>
            </div>

            <div
              style={{
                padding: 28,
                borderRadius: 24,
                background: "rgba(15, 12, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#8b5cf6",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 16,
                }}
              >
                Quick actions
              </p>
              <div style={{ display: "grid", gap: 14 }}>
                <a
                  href={`mailto:hello@lawconnect.com?subject=Book%20a%20consultation%20with%20${encodeURIComponent(
                    name,
                  )}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Book Consultation
                </a>
                <Link
                  href="/signup"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(124,58,237,0.35)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#dbeafe",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Create an account
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section
          style={{
            marginTop: 36,
            padding: 32,
            borderRadius: 24,
            background: "rgba(15, 12, 35, 0.95)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 28 }}>
            <div style={{ minWidth: 160 }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                About {name}
              </p>
              <h2 style={{ margin: "10px 0 0", fontSize: 24, color: "#f8fafc" }}>Expert legal counsel you can trust</h2>
            </div>
            <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 800, lineHeight: 1.8 }}>
              {name} is a proven legal professional with a deep track record in {specialization.toLowerCase()}. From strategic case planning to courtroom advocacy, {name} delivers calm, confident representation for individuals and businesses alike.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            <div style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.03)" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>Practice overview</p>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.75 }}>
                {bio}
              </p>
            </div>
            <div style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.03)" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>What to expect</p>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#cbd5e1", lineHeight: 1.8 }}>
                <li>Personalized intake and case review</li>
                <li>Transparent fee estimates and legal strategy</li>
                <li>Strong representation at every stage</li>
              </ul>
            </div>
            <div style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.03)" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>Success snapshot</p>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.75 }}>
                Represented clients across multiple states, resolved high-profile disputes, and earned top reviews for responsiveness, legal insight, and successful outcomes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
