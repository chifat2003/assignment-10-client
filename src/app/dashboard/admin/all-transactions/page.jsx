'use client';

import React from 'react';

const AllTransactions = () => {
  const transactions = [
    {
      id: 'TXN001',
      userEmail: 'john@example.com',
      lawyerEmail: 'sarah@example.com',
      amount: '$250',
      date: '2024-12-15',
      status: 'completed',
      type: 'hire',
    },
    {
      id: 'TXN002',
      userEmail: 'emily@example.com',
      lawyerEmail: 'michael@example.com',
      amount: '$180',
      date: '2024-12-14',
      status: 'completed',
      type: 'booking',
    },
    {
      id: 'TXN003',
      userEmail: 'robert@example.com',
      lawyerEmail: 'jessica@example.com',
      amount: '$320',
      date: '2024-12-13',
      status: 'pending',
      type: 'hire',
    },
    {
      id: 'TXN004',
      userEmail: 'alice@example.com',
      lawyerEmail: 'david@example.com',
      amount: '$200',
      date: '2024-12-12',
      status: 'completed',
      type: 'booking',
    },
    {
      id: 'TXN005',
      userEmail: 'michael@example.com',
      lawyerEmail: 'jennifer@example.com',
      amount: '$275',
      date: '2024-12-11',
      status: 'completed',
      type: 'hire',
    },
    {
      id: 'TXN006',
      userEmail: 'patricia@example.com',
      lawyerEmail: 'christopher@example.com',
      amount: '$190',
      date: '2024-12-10',
      status: 'pending',
      type: 'booking',
    },
    {
      id: 'TXN007',
      userEmail: 'david@example.com',
      lawyerEmail: 'sarah@example.com',
      amount: '$300',
      date: '2024-12-09',
      status: 'completed',
      type: 'hire',
    },
    {
      id: 'TXN008',
      userEmail: 'jane@example.com',
      lawyerEmail: 'michael@example.com',
      amount: '$150',
      date: '2024-12-08',
      status: 'failed',
      type: 'booking',
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        };
      case 'pending':
        return {
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
        };
      case 'failed':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
        };
      default:
        return {
          background: 'rgba(107, 114, 128, 0.2)',
          color: '#9ca3af',
        };
    }
  };

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
          All Transactions
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          View all platform transactions ({transactions.length} total)
        </p>
      </div>

      {/* Transactions Table */}
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
                  Transaction ID
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  User Email
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Lawyer Email
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Amount
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Date
                </th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Type
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
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => {
                const statusStyle = getStatusStyle(txn.status);
                return (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: index !== transactions.length - 1 ? '1px solid #3b4256' : 'none',
                      backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                      {txn.id}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {txn.userEmail}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {txn.lawyerEmail}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                      {txn.amount}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {txn.date}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                      <span style={{
                        background: txn.type === 'hire' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: txn.type === 'hire' ? '#c084fc' : '#60a5fa',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}>
                        {txn.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                      <span style={{
                        background: statusStyle.background,
                        color: statusStyle.color,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          table {
            font-size: 11px;
          }
          table td, table th {
            padding: 10px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AllTransactions;
