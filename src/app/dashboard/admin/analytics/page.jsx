'use client';

import React from 'react';

const Analytics = () => {
  const analyticsData = [
    {
      id: 1,
      label: 'Total Users',
      value: '342',
      icon: '👥',
      color: '#3b82f6',
      change: '+12.5%',
    },
    {
      id: 2,
      label: 'Total Lawyers',
      value: '87',
      icon: '⚖️',
      color: '#8b5cf6',
      change: '+8.2%',
    },
    {
      id: 3,
      label: 'Total Hires',
      value: '1,203',
      icon: '📝',
      color: '#10b981',
      change: '+24.8%',
    },
    {
      id: 4,
      label: 'Total Revenue',
      value: '$548,920',
      icon: '💰',
      color: '#f59e0b',
      change: '+18.3%',
    },
  ];

  const monthlyData = [
    { month: 'Jan', users: 240, lawyers: 45, hires: 380 },
    { month: 'Feb', users: 290, lawyers: 52, hires: 420 },
    { month: 'Mar', users: 320, lawyers: 62, hires: 510 },
    { month: 'Apr', users: 342, lawyers: 87, hires: 1203 },
  ];

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
          Analytics Overview
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          Platform statistics and performance metrics
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {analyticsData.map((stat) => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '500' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                  {stat.value}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>{stat.icon}</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid #3b4256',
            }}>
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>{stat.change}</span>
              <span style={{ color: '#9ca3af', fontSize: '11px' }}>from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Growth Chart */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #3b4256',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginBottom: '20px', margin: '0 0 20px 0' }}>
          Monthly Growth
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3b4256' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Month
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Users
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Lawyers
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                  Hires
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr
                  key={data.month}
                  style={{
                    borderBottom: index !== monthlyData.length - 1 ? '1px solid #3b4256' : 'none',
                    backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                    {data.month}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        background: 'linear-gradient(90deg, #3b82f6, #1e40af)',
                        height: '6px',
                        borderRadius: '3px',
                        width: `${(data.users / 350) * 100}%`,
                      }} />
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>{data.users}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                        height: '6px',
                        borderRadius: '3px',
                        width: `${(data.lawyers / 90) * 100}%`,
                      }} />
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>{data.lawyers}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        background: 'linear-gradient(90deg, #10b981, #047857)',
                        height: '6px',
                        borderRadius: '3px',
                        width: `${(data.hires / 1300) * 100}%`,
                      }} />
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>{data.hires}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          table {
            font-size: 12px;
          }
          table td, table th {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
