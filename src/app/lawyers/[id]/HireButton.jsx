'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function HireButton({ lawyerId, lawyerName, lawyerEmail, specialization, fee }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHiring, setIsHiring] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleHire = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    if (session.user.role !== 'user') {
      alert('Only regular users can hire lawyers');
      return;
    }

    setShowModal(true);
  };

  const confirmHire = async () => {
    setIsHiring(true);

    try {
      const res = await fetch('/api/hirings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId,
          lawyerName,
          lawyerEmail,
          specialization,
          fee,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create hiring request');
      }

      setShowModal(false);
      alert('Hiring request sent! Check your dashboard to track the status.');
      router.push('/dashboard/user/hiring-history');
    } catch (err) {
      console.error('Error creating hiring:', err);
      alert(err.message || 'Failed to send hiring request. Please try again.');
    } finally {
      setIsHiring(false);
    }
  };

  return (
    <>
      <button
        onClick={handleHire}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '13px 18px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Hire {lawyerName.split(' ')[0]}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #0f0c23 0%, #16213e 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              padding: 28,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
              Confirm Hiring Request
            </h2>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                marginBottom: 20,
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#94a3b8' }}>Lawyer</p>
              <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
                {lawyerName}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b5cf6' }}>{specialization}</p>
              <p style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 800, color: '#818cf8' }}>
                ${fee}/hr
              </p>
            </div>

            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              Your hiring request will be sent to {lawyerName}. Once they accept, you'll be able to
              proceed with payment from your dashboard.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={isHiring}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#94a3b8',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isHiring ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmHire}
                disabled={isHiring}
                style={{
                  flex: 2,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: 'none',
                  background: isHiring
                    ? 'rgba(99,102,241,0.4)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isHiring ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {isHiring ? (
                  <>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Sending…
                  </>
                ) : (
                  'Confirm & Send Request'
                )}
              </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
    </>
  );
}
