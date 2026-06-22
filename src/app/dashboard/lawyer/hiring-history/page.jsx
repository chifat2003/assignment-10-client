'use client';

import React, { useState } from 'react';

const LawyerHiringHistory = () => {
  const [hiringRequests, setHiringRequests] = useState([
    {
      id: 1,
      clientName: 'John Smith',
      clientEmail: 'john@example.com',
      requestDate: '2024-12-15',
      serviceType: 'Contract Review',
      status: 'pending',
    },
    {
      id: 2,
      clientName: 'Emily Davis',
      clientEmail: 'emily@example.com',
      requestDate: '2024-12-14',
      serviceType: 'Legal Consultation',
      status: 'pending',
    },
    {
      id: 3,
      clientName: 'Robert Wilson',
      clientEmail: 'robert@example.com',
      requestDate: '2024-12-13',
      serviceType: 'Document Drafting',
      status: 'pending',
    },
    {
      id: 4,
      clientName: 'Alice Brown',
      clientEmail: 'alice@example.com',
      requestDate: '2024-12-12',
      serviceType: 'Legal Consultation',
      status: 'pending',
    },
  ]);

  const handleAccept = (id) => {
    setHiringRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'accepted' } : req
      )
    );
  };

  const handleReject = (id) => {
    setHiringRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

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
                  Service Type
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
                    {request.clientName}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    {request.clientEmail}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    <span style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c084fc',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      {request.serviceType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                    {request.requestDate}
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
                      <span style={{ color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>
                        {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </span>
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
