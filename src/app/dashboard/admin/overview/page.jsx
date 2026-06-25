'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/app/hooks/useAdmin';
import { AdminGuard } from '@/app/components/AdminGuard';

const OverviewPage = () => {
  const { fetchAdminStats } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, [fetchAdminStats]);

  const StatCard = ({ label, value, icon, color }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: `2px solid ${color}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: `0 0 20px ${color}20`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 0 30px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 0 20px ${color}20`;
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 8px 0', fontWeight: '500' }}>
            {label}
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: color, margin: 0 }}>
            {value}
          </p>
        </div>
        <div style={{ fontSize: '32px' }}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminGuard>
        <div style={{ padding: '24px' }}>Loading overview...</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div style={{ padding: '24px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
            Platform Overview
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Real-time platform statistics and insights
          </p>
        </div>

        {/* Main Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <StatCard label="Total Users" value={stats?.totalUsers || 0} icon="👥" color="#3b82f6" />
          <StatCard label="Total Lawyers" value={stats?.totalLawyers || 0} icon="⚖️" color="#8b5cf6" />
          <StatCard label="Admin Accounts" value={stats?.totalAdmins || 0} icon="🔐" color="#f59e0b" />
          <StatCard label="Blocked Users" value={stats?.blockedUsers || 0} icon="🚫" color="#ef4444" />
          <StatCard label="Total Services" value={stats?.totalServices || 0} icon="📋" color="#10b981" />
        </div>

        {/* Growth Metrics */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #3b4256',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>
            Platform Health
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                User Ratio
              </p>
              <div style={{ position: 'relative', height: '8px', background: '#2a2d3a', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${(stats?.totalLawyers / (stats?.totalUsers || 1)) * 100}%`,
                    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                  }}
                />
              </div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '8px 0 0 0' }}>
                {stats?.totalLawyers} lawyers out of {stats?.totalUsers} users
              </p>
            </div>

            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                System Status
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ color: '#10b981', fontWeight: '500' }}>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #3b4256',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>
            Quick Access
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <a
              href="/dashboard/admin/manage-users"
              style={{
                padding: '12px 16px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: '#60a5fa',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Manage Users
            </a>

            <a
              href="/dashboard/admin/analytics"
              style={{
                padding: '12px 16px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid #8b5cf6',
                borderRadius: '8px',
                color: '#c084fc',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Analytics
            </a>

            <a
              href="/dashboard/admin/all-transactions"
              style={{
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: '#6ee7b7',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              All Transactions
            </a>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </AdminGuard>
  );
};

export default OverviewPage;
