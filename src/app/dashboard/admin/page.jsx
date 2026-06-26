'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { AdminGuard } from '@/app/components/AdminGuard';
import { useAdmin } from '@/app/hooks/useAdmin';

const AdminDashboard = () => {
  const { data: session, isPending } = useSession();
  const { fetchAdminStats } = useAdmin();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [fetchAdminStats]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/admin/transactions', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) {
          console.error('Failed to fetch transactions:', res.statusText);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setTransactionLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isPending || statsLoading) return <LoadingSpinner size="lg" />;

  const adminStats = [
    {
      id: 1,
      label: 'Total Users',
      value: stats?.totalUsers || '342',
      icon: '👥',
      color: '#3b82f6',
    },
    {
      id: 2,
      label: 'Total Lawyers',
      value: stats?.totalLawyers || '87',
      icon: '⚖️',
      color: '#8b5cf6',
    },
    {
      id: 3,
      label: 'Total Hires',
      value: stats?.totalTransactions || '1,203',
      icon: '📝',
      color: '#10b981',
    },
    {
      id: 4,
      label: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: '💰',
      color: '#f59e0b',
    },
  ];

  const getStatusStyle = (status) => {
    if (status === 'completed') {
      return {
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
      };
    }
    return {
      background: 'rgba(245, 158, 11, 0.2)',
      color: '#f59e0b',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
    };
  };

  const getTypeStyle = (type) => {
    if (type === 'hire') {
      return {
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#c084fc',
      };
    }
    return {
      background: 'rgba(59, 130, 246, 0.2)',
      color: '#60a5fa',
    };
  };

  return (
    <AdminGuard>
      <div style={{ padding: '24px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Platform overview and transaction history
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {adminStats.map((stat) => (
            <div
              key={stat.id}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #3b4256',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stat.color;
                e.currentTarget.style.boxShadow = `0 0 12px ${stat.color}40`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3b4256';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction History Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #3b4256',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {/* Section Header */}
          <div style={{
            padding: '20px 20px',
            borderBottom: '1px solid #3b4256',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
              Transaction History
            </h2>
          </div>

          {/* Transactions Table */}
          {transactionLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              No transactions yet
            </div>
          ) : (
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
                      User
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#9ca3af',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}>
                      Lawyer
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const typeStyle = getTypeStyle(transaction.type || 'hire');
                    const statusStyle = getStatusStyle(transaction.status || 'pending');
                    const userName = transaction.userEmail?.split('@')[0] || 'User';
                    const lawyerName = transaction.lawyerName || transaction.lawyerEmail?.split('@')[0] || 'Lawyer';

                    return (
                      <tr
                        key={transaction.id}
                        style={{
                          borderBottom: index !== transactions.length - 1 ? '1px solid #3b4256' : 'none',
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                          <span style={{
                            background: typeStyle.background,
                            color: typeStyle.color,
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize',
                          }}>
                            {transaction.specialization || 'hire'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                          {userName}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                          {lawyerName}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                          ${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                          <span style={statusStyle}>
                            {transaction.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Responsive styles for mobile */}
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
    </AdminGuard>
  );
};

export default AdminDashboard;
