'use client';

import { useState, useRef } from 'react';
import { useSession } from '@/lib/auth-client';

const inputStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f1f5f9',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

export default function LawyerUpdateProfile() {
  const { data: session, isPending } = useSession();

  const [fullName,      setFullName]      = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio,           setBio]           = useState('');
  const [phone,         setPhone]         = useState('');
  const [location,      setLocation]      = useState('');
  const [preview,       setPreview]       = useState(null);
  const [fileName,      setFileName]      = useState('');
  const [saving,        setSaving]        = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState('');
  const fileRef = useRef(null);

  // Pre-fill name once session loads
  if (!isPending && session?.user?.name && fullName === '') {
    setFullName(session.user.name);
  }

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
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      // TODO: wire up to real update profile API
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div>;

  const avatarSrc = preview || session?.user?.image || null;
  const initials = (fullName || session?.user?.name || 'L')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        @media (min-width: 640px) { .lup-card { padding: 28px !important; } }
        .lup-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 480px) { .lup-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>Update Profile</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#94a3b8' }}>
          Update your name, photo, and professional details.
        </p>
      </div>

      {/* Card */}
      <div
        className="lup-card"
        style={{ width: '100%', maxWidth: 600, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 20, boxSizing: 'border-box' }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
              {avatarSrc
                ? <img src={avatarSrc} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>{initials}</span>
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                Choose Photo
              </button>
              {fileName && <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Name + Email row */}
          <div className="lup-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="fullName" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Full Name</label>
              <input
                id="fullName" type="text" value={fullName} required
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
                Email <span style={{ color: '#475569', fontWeight: 400 }}>(read-only)</span>
              </label>
              <input
                id="email" type="email" disabled value={session?.user?.email || ''}
                style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#475569', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          {/* Specialization + Phone row */}
          <div className="lup-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="specialization" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Specialization</label>
              <input
                id="specialization" type="text" value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Corporate Law"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="phone" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Phone</label>
              <input
                id="phone" type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="location" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Location</label>
            <input
              id="location" type="text" value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="bio" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Professional Bio</label>
            <textarea
              id="bio" value={bio} rows={4}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of your legal expertise and experience..."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Feedback */}
          {success && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', fontSize: 13, fontWeight: 500 }}>
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={saving}
            style={{ padding: '11px 0', borderRadius: 10, border: 'none', background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
