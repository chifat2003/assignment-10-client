import Link from "next/link";
import { notFound } from "next/navigation";
import HireButton from "./HireButton";

async function findLawyerFromAPI(id) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/users`);
    if (!response.ok) return null;
    
    const users = await response.json();
    const user = users.find(u => u._id === id && u.role === 'lawyer');
    
    if (!user) return null;

    // Parse languages if it's a string, otherwise use as array
    let languages = [];
    if (user.languages) {
      if (typeof user.languages === 'string') {
        try {
          languages = JSON.parse(user.languages);
        } catch {
          languages = [user.languages];
        }
      } else if (Array.isArray(user.languages)) {
        languages = user.languages;
      }
    }

    // Map API data to component structure
    return {
      id: user._id,
      name: user.name,
      title: `${user.experience || 0} years experience`,
      specialization: user.specialization || 'General Practice',
      avatar: user.image || 'https://i.ibb.co/default-avatar.jpg',
      rating: user.rating || 0,
      reviewCount: user.reviewCount || 0,
      experience: user.experience || 0,
      casesWon: user.caseWon || 0,
      successRate: user.rating ? Math.round(user.rating * 20) : 0,
      bio: user.bio || 'Professional lawyer',
      location: user.location || 'Not specified',
      languages: Array.isArray(languages) ? languages : [],
      fee: 150,
      availability: user.availability || 'Available',
      badge: user.rating >= 4.5 ? 'Top Rated' : user.rating >= 4 ? 'Verified' : null,
      tags: ['Licensed', 'Verified'],
    };
  } catch (error) {
    console.error('Error fetching lawyer from API:', error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lawyer = await findLawyerFromAPI(resolvedParams.id);
  if (!lawyer) return { title: "Lawyer Not Found" };
  return {
    title: `${lawyer.name} | Lawyer Details`,
    description: `${lawyer.name} is a ${lawyer.specialization} expert with ${lawyer.experience} years of experience.`,
  };
}

export default async function LawyerDetailsPage({ params }) {
  const resolvedParams = await params;
  const lawyer = await findLawyerFromAPI(resolvedParams.id);
  if (!lawyer) notFound();

  const { name, title, specialization, avatar, rating, reviewCount, experience, casesWon, location, languages, fee, availability, badge, tags, bio, successRate } = lawyer;

  const availabilityStyles = {
    Available:   { color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
    Busy:        { color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
    Unavailable: { color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  };
  const avail = availabilityStyles[availability] ?? availabilityStyles.Available;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)", padding: "24px 16px", color: "#e2e8f0" }}>
      <style>{`
        @media (min-width: 640px)  { .ld-main { padding: 40px 24px !important; } }
        @media (min-width: 1024px) { .ld-main { padding: 48px 32px !important; } }

        /* Page header row */
        .ld-header { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        @media (min-width: 768px) {
          .ld-header { flex-direction: row; align-items: flex-start; justify-content: space-between; gap: 20px; }
        }

        /* Main two-column layout */
        .ld-layout { display: flex; flex-direction: column; gap: 20px; }
        @media (min-width: 1024px) {
          .ld-layout { display: grid !important; grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr); gap: 28px; }
        }

        /* Avatar + info row inside card */
        .ld-profile-row { display: grid; grid-template-columns: 80px 1fr; gap: 16px; align-items: center; }
        @media (min-width: 480px) { .ld-profile-row { grid-template-columns: 100px 1fr; gap: 24px; } }

        /* Stats row */
        .ld-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
        @media (min-width: 480px) { .ld-stats { gap: 18px; margin-top: 28px; } }

        /* Location + Languages row */
        .ld-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }

        /* Bottom about section */
        .ld-about-header { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        @media (min-width: 640px) { .ld-about-header { flex-direction: row; flex-wrap: wrap; gap: 18px; align-items: flex-start; } }
      `}</style>

      <div className="ld-main" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Page header */}
        <div className="ld-header">
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a78bfa" }}>Lawyer Profile</p>
            <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f8fafc" }}>{name}</h1>
            <p style={{ margin: "12px 0 0", color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
              {title} specializing in {specialization}. {bio}
            </p>
          </div>

          <Link
            href="/lawyers"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 14, border: "1px solid rgba(139,92,246,0.35)", background: "rgba(31,41,55,0.7)", color: "#c7d2fe", textDecoration: "none", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}
          >
            ← Back
          </Link>
        </div>

        {/* Main layout */}
        <section className="ld-layout">

          {/* Left card */}
          <div style={{ borderRadius: 24, background: "rgba(15, 12, 35, 0.98)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ padding: 20 }}>

              {/* Avatar row */}
              <div className="ld-profile-row">
                <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(124,58,237,0.35)", background: "#11111a", flexShrink: 0 }}>
                  <img src={avatar} alt={`${name} avatar`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  {/* <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(139,92,246,0.08)", fontSize: 11, fontWeight: 700, color: "#e0e7ff", marginBottom: 8 }}>
                    {badge}
                  </span> */}
                  <h2>{name}</h2>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em" }}>{specialization}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>{availability}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="ld-stats">
                {[
                  { label: "Rating",  value: `${rating}/5` },
                  { label: "Reviews", value: reviewCount   },
                  { label: "Success", value: `${successRate}%` },
                ].map((s) => (
                  <div key={s.label} style={{ padding: "14px 12px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Location + Languages */}
              <div style={{ marginTop: 24 }}>
                <div className="ld-meta">
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Location</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>{location}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Languages</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>{languages.join(", ")}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{ padding: "7px 12px", borderRadius: 999, background: "rgba(124,58,237,0.12)", color: "#c4b5fd", fontSize: 12, fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Consultation details */}
            <div style={{ padding: 24, borderRadius: 24, background: "rgba(15, 12, 35, 0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.14em" }}>Consultation Details</p>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "Hourly fee", value: `$${fee} / hr`, big: true },
                  { label: "Experience", value: `${experience} years` },
                  { label: "Cases won",  value: casesWon },
                ].map((item) => (
                  <div key={item.label}>
                    <span style={{ display: "block", color: "#94a3b8", fontSize: 12 }}>{item.label}</span>
                    <span style={{ fontSize: item.big ? 24 : 17, fontWeight: 800, color: "#f1f5f9" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ padding: 24, borderRadius: 24, background: "rgba(15, 12, 35, 0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}>Availability</p>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: "#f8fafc" }}>{availability}</p>
                </div>
                <span style={{ padding: "7px 12px", borderRadius: 999, background: avail.bg, color: avail.color, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>
                  {availability}
                </span>
              </div>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
                Ready to start your case with a trusted advisor. Book a one-on-one consultation and get fast guidance from a top-rated attorney.
              </p>
            </div>

            {/* Quick actions */}
            <div style={{ padding: 24, borderRadius: 24, background: "rgba(15, 12, 35, 0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.14em" }}>Quick Actions</p>
              <div style={{ display: "grid", gap: 12 }}>
                <HireButton
                  lawyerId={lawyer.id}
                  lawyerName={lawyer.name}
                  lawyerEmail="lawyer@example.com"
                  specialization={lawyer.specialization}
                  fee={lawyer.fee}
                />
                <a
                  href={`mailto:hello@lawconnect.com?subject=Consultation%20inquiry%20from%20${encodeURIComponent(name)}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px 18px", borderRadius: 14, border: "1px solid rgba(124,58,237,0.35)", background: "rgba(255,255,255,0.04)", color: "#dbeafe", fontWeight: 700, textDecoration: "none", fontSize: 14 }}
                >
                  Email Inquiry
                </a>
              </div>
            </div>
          </aside>
        </section>

        {/* About section */}
        <section style={{ marginTop: 24, padding: 24, borderRadius: 24, background: "rgba(15, 12, 35, 0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="ld-about-header">
            <div style={{ minWidth: 160 }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>About {name}</p>
              <h2 style={{ margin: "8px 0 0", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "#f8fafc", lineHeight: 1.3 }}>Expert legal counsel you can trust</h2>
            </div>
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.8, fontSize: 14, maxWidth: 760 }}>
              {name} is a proven legal professional with a deep track record in {specialization.toLowerCase()}. From strategic case planning to courtroom advocacy, {name} delivers calm, confident representation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { heading: "Practice overview", content: <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.75, fontSize: 13 }}>{bio}</p> },
              { heading: "What to expect",    content: <ul style={{ margin: 0, paddingLeft: 18, color: "#cbd5e1", lineHeight: 1.8, fontSize: 13 }}><li>Personalized intake and case review</li><li>Transparent fee estimates and legal strategy</li><li>Strong representation at every stage</li></ul> },
              { heading: "Success snapshot",  content: <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.75, fontSize: 13 }}>Represented clients across multiple states, resolved high-profile disputes, and earned top reviews for responsiveness and legal insight.</p> },
            ].map(({ heading, content }) => (
              <div key={heading} style={{ padding: 20, borderRadius: 18, background: "rgba(255,255,255,0.03)" }}>
                <p style={{ margin: "0 0 10px", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{heading}</p>
                {content}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
