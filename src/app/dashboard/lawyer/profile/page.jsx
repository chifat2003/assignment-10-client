'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';

const LawyerProfilePage = () => {
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setProfile(session.user);
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        specialization: session.user.specialization || '',
        bio: session.user.bio || '',
        location: session.user.location || '',
        experience: session.user.experience || 0,
        rating: session.user.rating || 0,
        successRate: session.user.successRate || 0,
        caseWon: session.user.caseWon || 0,
      });
      setIsLoading(false);
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfile(formData);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (isPending || isLoading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
          Lawyer Profile
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          View and manage your professional profile
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            background: message.includes('success') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${message.includes('success') ? '#10b981' : '#ef4444'}`,
            color: message.includes('success') ? '#6ee7b7' : '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          {message}
        </div>
      )}

      {/* Main Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #3b4256',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        {/* Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
              {profile?.name || 'Lawyer Name'}
            </h2>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              {profile?.email}
            </p>
          </div>
          <button
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            disabled={saving}
            style={{
              padding: '10px 20px',
              background: isEditing ? '#10b981' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
            padding: '16px 0',
            borderTop: '1px solid #3b4256',
            borderBottom: '1px solid #3b4256',
          }}
        >
          <div>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0' }}>Rating</p>
            <p style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              ⭐ {profile?.rating || 0}/5
            </p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0' }}>Cases Won</p>
            <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {profile?.caseWon || 0}
            </p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0' }}>Success Rate</p>
            <p style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {profile?.successRate || 0}%
            </p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0' }}>Experience</p>
            <p style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {profile?.experience || 0}+ yrs
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Name */}
          <div>
            <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            ) : (
              <p style={{ color: '#e5e7eb', margin: 0 }}>{profile?.name}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Specialization
            </label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            ) : (
              <p style={{ color: '#e5e7eb', margin: 0 }}>{profile?.specialization || 'Not specified'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            ) : (
              <p style={{ color: '#e5e7eb', margin: 0 }}>{profile?.location || 'Not specified'}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Years of Experience
            </label>
            {isEditing ? (
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            ) : (
              <p style={{ color: '#e5e7eb', margin: 0 }}>{profile?.experience} years</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
            Professional Bio
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid #3b4256',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          ) : (
            <p style={{ color: '#e5e7eb', margin: 0, whiteSpace: 'pre-wrap' }}>
              {profile?.bio || 'No bio provided'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerProfilePage;
