'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

/* ── shared input style ──────────────────────────────────────── */
const inputBase = {
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f1f5f9',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const disabledInput = {
  ...inputBase,
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#475569',
  cursor: 'not-allowed',
};

/* ── helpers ─────────────────────────────────────────────────── */
function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}

export default function UserUpdateProfile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [fullName,  setFullName]  = useState('');
  const [preview,   setPreview]   = useState(null);
  const [fileName,  setFileName]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');
  const fileRef = useRef(null);

  /* Pre-fill name once session loads */
  useEffect(() => {
    if (!isPending && session?.user?.name) {
      setFullName(session.user.name);
    }
  }, [isPending, session]);

  /* Redirect non-users */
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    }
    if (!isPending && session?.user?.role && session.user.role !== 'user') {
      router.replace(`/dashboard/${session.user.role}`);
    }
  }, [isPending, session, router]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const { error: updateError } = await authClient.updateUser({ name: fullName.trim() });
      if (updateError) {
        setError(updateError.message || 'Failed to update profile.');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      setError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="uup-spinner" />
          <span style={{ color: '#64748b', fontSize: 14 }}>Loading profile…</span>
        </div>
        <style>{`
          .uup-spinner {
            width: 36px; height: 36px;
            border: 3px solid rgba(99,102,241,0.2);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: uup-spin 0.8s linear infinite;
          }
          @keyframes uup-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const avatarSrc = preview || session?.user?.image || null;
  const initials  = getInitials(fullName || session?.user?.name);

  return (
    <div style={{ padding: 16, maxWidth: 680, margin: '0 auto' }}>
      <style>{`
        @media (min-width: 640px) { .uup-wrap { padding: 28px !important; } }
        .uup-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 480px) { .uup-grid { grid-template-columns: 1fr 1fr; } }
        .uup-avatar-ring {
          width: 84px; height: 84px; border-radius: 50%; overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(99,102,241,0.4);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
          position: relative;
        }
        .uup-avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
        .uup-avatar-ring .initials { color: #fff; font-weight: 800; font-size: 28px; letter-spacing: -1px; }
        .uup-photo-btn {
          padding: 8px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: #e2e8f0; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.2s;
          white-space: nowrap;
        }
        .uup-photo-btn:hover { background: rgba(255,255,255,0.1); }
        .uup-submit-btn {
          padding: 12px 0; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          width: 100%;
        }
        .uup-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .uup-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .uup-submit-btn:disabled { background: rgba(99,102,241,0.4); cursor: not-allowed; }
        .uup-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; display: block; }
        .uup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .uup-section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          {/* Back pill */}
          <button
            type="button"
            onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>Update Profile</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#64748b' }}>
          Manage your personal information and account details.
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className="uup-wrap"
        style={{
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Avatar section ── */}
          <div>
            <p className="uup-section-title">Profile Photo</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div className="uup-avatar-ring">
                {avatarSrc
                  ? <img src={avatarSrc} alt="Profile preview" />
                  : <span className="initials">{initials}</span>
                }
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                <button
                  type="button"
                  className="uup-photo-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  📷&nbsp; Choose Photo
                </button>
                {fileName && (
                  <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                    {fileName}
                  </span>
                )}
                <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>
                  JPG, PNG or GIF · max 5 MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="uup-divider" />

          {/* ── Personal info ── */}
          <div>
            <p className="uup-section-title">Personal Information</p>
            <div className="uup-grid">
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="uup-fullname" className="uup-label">Full Name</label>
                <input
                  id="uup-fullname"
                  type="text"
                  value={fullName}
                  required
                  placeholder="Your full name"
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              {/* Email (read-only) */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="uup-email" className="uup-label">
                  Email&nbsp;<span style={{ color: '#475569', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(read-only)</span>
                </label>
                <input
                  id="uup-email"
                  type="email"
                  disabled
                  value={session?.user?.email || ''}
                  style={disabledInput}
                />
              </div>
            </div>
          </div>

          <div className="uup-divider" />

          {/* ── Account info ── */}
          <div>
            <p className="uup-section-title">Account Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoRow label="Account ID" value={session?.user?.id ? `…${session.user.id.slice(-8)}` : '—'} />
              <InfoRow
                label="Member Since"
                value={
                  session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'
                }
              />
              <InfoRow label="Account Role" value="User" highlight />
            </div>
          </div>

          {/* ── Feedback banners ── */}
          {success && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#4ade80', fontSize: 14, fontWeight: 500,
                animation: 'uup-fadein 0.3s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9.5L7 13.5L15 5.5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontSize: 14, fontWeight: 500,
                animation: 'uup-fadein 0.3s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#f87171" strokeWidth="1.5"/><path d="M9 5.5V9.5" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="12" r="0.75" fill="#f87171"/></svg>
              {error}
            </div>
          )}

          <style>{`@keyframes uup-fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }`}</style>

          {/* ── Submit button ── */}
          <button type="submit" className="uup-submit-btn" disabled={saving}>
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="uup-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Saving…
              </span>
            ) : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Small read-only info row ── */
function InfoRow({ label, value, highlight = false }) {
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', borderRadius: 10,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        gap: 12, flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span
        style={{
          fontSize: 13, fontWeight: 600,
          color: highlight ? '#818cf8' : '#94a3b8',
        }}
      >
        {value}
      </span>
    </div>
  );
}
