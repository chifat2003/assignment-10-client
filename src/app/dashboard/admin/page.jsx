'use client';

import React from 'react';

const AdminDashboard = () => {
  // Mock admin stats data
  const adminStats = [
    {
      id: 1,
      label: 'Total Users',
      value: '342',
      icon: '👥',
      color: '#3b82f6',
    },
    {
      id: 2,
      label: 'Total Lawyers',
      value: '87',
      icon: '⚖️',
      color: '#8b5cf6',
    },
    {
      id: 3,
      label: 'Total Hires',
      value: '1,203',
      icon: '📝',
      color: '#10b981',
    },
    {
      id: 4,
      label: 'Total Revenue',
      value: '$548,920',
      icon: '💰',
      color: '#f59e0b',
    },
  ];

  // Mock transaction history data
  const transactions = [
    {
      id: 1,
      type: 'hire',
      user: 'John Smith',
      lawyer: 'Sarah Johnson',
      amount: '$250',
      date: '2024-12-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'booking',
      user: 'Emily Davis',
      lawyer: 'Michael Chen',
      amount: '$180',
      date: '2024-12-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'hire',
      user: 'Robert Wilson',
      lawyer: 'Jessica Martinez',
      amount: '$320',
      date: '2024-12-13',
      status: 'pending',
    },
    {
      id: 4,
      type: 'booking',
      user: 'Alice Brown',
      lawyer: 'David Lee',
      amount: '$200',
      date: '2024-12-12',
      status: 'completed',
    },
    {
      id: 5,
      type: 'hire',
      user: 'Michael Garcia',
      lawyer: 'Jennifer White',
      amount: '$275',
      date: '2024-12-11',
      status: 'completed',
    },
    {
      id: 6,
      type: 'booking',
      user: 'Patricia Taylor',
      lawyer: 'Christopher Anderson',
      amount: '$190',
      date: '2024-12-10',
      status: 'pending',
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

  return (
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
              {transactions.map((transaction, index) => (
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
                      background: transaction.type === 'hire' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: transaction.type === 'hire' ? '#c084fc' : '#60a5fa',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                    }}>
                      {transaction.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    {transaction.user}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                    {transaction.lawyer}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                    {transaction.amount}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                    {transaction.date}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                    <span style={getStatusStyle(transaction.status)}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  );
};

export default AdminDashboard;
