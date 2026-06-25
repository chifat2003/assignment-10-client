'use client';

import React, { useState, useEffect } from 'react';

const LawyerHiringHistory = () => {
  const [hiringRequests, setHiringRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchHirings();
  }, []);

  const fetchHirings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/hirings');
      if (!res.ok) throw new Error('Failed to fetch hirings');
      const data = await res.json();
      setHiringRequests(data);
    } catch (err) {
      console.error('Error fetching hirings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/hirings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (!res.ok) throw new Error('Failed to accept hiring');

      setSuccessMessage('Hiring request accepted');
      fetchHirings();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error accepting hiring:', err);
      alert('Failed to accept hiring request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/hirings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!res.ok) throw new Error('Failed to reject hiring');

      setSuccessMessage('Hiring request rejected');
      fetchHirings();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error rejecting hiring:', err);
      alert('Failed to reject hiring request');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', width: '100%', color: '#9ca3af' }}>
        Loading hiring requests...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
          Hiring Requests
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          Review and manage client hiring requests
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          {successMessage}
        </div>
      )}

      {/* Requests Table */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #3b4256',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3b4256' }}>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Client Name
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Email
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Service / Fee
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Request Date
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Status
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {hiringRequests.map((request, index) => (
                <tr
                  key={request.id}
                  style={{
                    borderBottom: index !== hiringRequests.length - 1 ? '1px solid #3b4256' : 'none',
                    backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    {request.userName || 'N/A'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    {request.userEmail || 'N/A'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    <div>
                      <span style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#c084fc',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {request.serviceName || request.specialization || 'General'}
                      </span>
                      <span style={{ display: 'block', fontSize: 12, color: '#6366f1', marginTop: 4 }}>${request.fee}/hr</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                    {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                    <span style={{
                      background: request.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 
                               request.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' :
                               'rgba(239, 68, 68, 0.2)',
                      color: request.status === 'pending' ? '#f59e0b' :
                            request.status === 'accepted' ? '#10b981' : '#ef4444',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                    }}>
                      {request.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    {request.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleAccept(request.id)}
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#059669'}
                          onMouseLeave={(e) => e.target.style.background = '#10b981'}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span style={{ color: request.status === 'accepted' ? '#10b981' : '#ef4444', fontSize: '12px', fontStyle: 'italic' }}>
                          {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                        {request.paymentStatus === 'paid' && (
                          <span style={{ display: 'block', fontSize: 11, color: '#6366f1', marginTop: 2 }}>
                            💳 Paid
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hiringRequests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <p>No hiring requests at the moment</p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          table {
            font-size: 12px;
          }
          table td, table th {
            padding: 12px 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LawyerHiringHistory;
