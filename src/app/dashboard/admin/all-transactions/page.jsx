'use client';

import React, { useState, useEffect } from 'react';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  if (isLoading) {
    return (
      <div style={{ padding: '24px', width: '100%', color: '#9ca3af' }}>
        Loading transactions...
      </div>
    );
  }

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

      {transactions.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#475569' }}>
          <p style={{ fontSize: 16, fontWeight: 700 }}>No transactions yet</p>
          <p style={{ fontSize: 14 }}>Transactions will appear here once users make payments</p>
        </div>
      ) : (

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
                      {txn.stripePaymentIntentId?.substring(3, 15) || txn.id}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {txn.userEmail}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {txn.lawyerEmail}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                      ${txn.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                      <span style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#c084fc',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}>
                        {txn.specialization || txn.serviceName || 'Legal Service'}
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
      )}

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
