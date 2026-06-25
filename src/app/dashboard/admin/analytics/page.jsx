'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/app/hooks/useAdmin';
import { AdminGuard } from '@/app/components/AdminGuard';

const AnalyticsPage = () => {
  const { fetchAdminStats, fetchAllUsers } = useAdmin();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([fetchAdminStats(), fetchAllUsers()]);
        setStats(statsData);
        setUsers(usersData || []);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAdminStats, fetchAllUsers]);

  const AnalyticsCard = ({ title, value, subtitle, trend, icon }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #3b4256',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#60a5fa';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#3b4256';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, fontWeight: '500' }}>{title}</p>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
        {value}
      </p>
      {subtitle && (
        <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
          {subtitle}
        </p>
      )}
      {trend && (
        <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
          <p style={{ color: '#10b981', fontSize: '12px', margin: 0, fontWeight: '500' }}>
            {trend}
          </p>
        </div>
      )}
    </div>
  );

  const Chart = ({ title, data }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #3b4256',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>
        {title}
      </h3>

      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '500' }}>{item.label}</span>
            <span style={{ color: item.color, fontSize: '13px', fontWeight: 'bold' }}>{item.value}</span>
          </div>
          <div style={{ position: 'relative', height: '8px', background: '#2a2d3a', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${item.percentage}%`,
                background: item.color,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <AdminGuard>
        <div style={{ padding: '24px' }}>Loading analytics...</div>
      </AdminGuard>
    );
  }

  const userRoleDistribution = [
    { label: 'Users', value: stats?.totalUsers - stats?.totalLawyers - stats?.totalAdmins || 0, color: '#3b82f6' },
    { label: 'Lawyers', value: stats?.totalLawyers || 0, color: '#8b5cf6' },
    { label: 'Admins', value: stats?.totalAdmins || 0, color: '#f59e0b' },
  ];

  const totalPeople = (stats?.totalUsers || 0) + (stats?.totalLawyers || 0) + (stats?.totalAdmins || 0);

  const rolePercentages = userRoleDistribution.map((item) => ({
    ...item,
    percentage: totalPeople > 0 ? (item.value / totalPeople) * 100 : 0,
  }));

  const conversionMetrics = [
    {
      label: 'Lawyer Ratio',
      value: stats?.totalLawyers || 0,
      color: '#8b5cf6',
      percentage: stats?.totalUsers ? (stats.totalLawyers / stats.totalUsers) * 100 : 0,
    },
    {
      label: 'Block Rate',
      value: stats?.blockedUsers || 0,
      color: '#ef4444',
      percentage: stats?.totalUsers ? (stats.blockedUsers / stats.totalUsers) * 100 : 0,
    },
    {
      label: 'Active Rate',
      value: (stats?.totalUsers || 0) - (stats?.blockedUsers || 0),
      color: '#10b981',
      percentage: stats?.totalUsers ? (((stats.totalUsers || 0) - (stats.blockedUsers || 0)) / (stats.totalUsers || 1)) * 100 : 0,
    },
  ];

  return (
    <AdminGuard>
      <div style={{ padding: '24px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
            Platform Analytics
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Detailed analytics and insights about platform performance
          </p>
        </div>

        {/* Top Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <AnalyticsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            subtitle="All registered users"
            trend="↑ 12% from last month"
          />
          <AnalyticsCard
            title="Total Lawyers"
            value={stats?.totalLawyers || 0}
            icon="⚖️"
            subtitle="Active legal professionals"
            trend="↑ 8% from last month"
          />
          <AnalyticsCard
            title="Total Services"
            value={stats?.totalServices || 0}
            icon="📋"
            subtitle="Available services"
            trend="↑ 15% from last month"
          />
          <AnalyticsCard
            title="Blocked Users"
            value={stats?.blockedUsers || 0}
            icon="🚫"
            subtitle="Suspended accounts"
            trend={`${stats?.blockedUsers ? '↑' : '→'} ${stats?.blockedUsers || 0} blocked`}
          />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <Chart title="User Role Distribution" data={rolePercentages} />
          <Chart title="Conversion & Health Metrics" data={conversionMetrics} />
        </div>

        {/* Detailed Statistics */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #3b4256',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>
            System Overview
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Average Users Per Lawyer
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                {stats?.totalLawyers ? Math.round((stats.totalUsers / stats.totalLawyers) * 10) / 10 : 0}
              </p>
            </div>

            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Platform Health
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                98.5%
              </p>
            </div>

            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Services Per Category
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>
                {stats?.totalServices ? Math.round((stats.totalServices / 5) * 10) / 10 : 0}
              </p>
            </div>

            <div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Admin Coverage
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                {stats?.totalAdmins || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #3b4256',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>
            Quick Stats
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px 0' }}>Active Users</p>
              <p style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {(stats?.totalUsers || 0) - (stats?.blockedUsers || 0)}
              </p>
            </div>

            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px 0' }}>Lawyer Conversion</p>
              <p style={{ color: '#c084fc', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {stats?.totalUsers ? Math.round((stats.totalLawyers / stats.totalUsers) * 100) : 0}%
              </p>
            </div>

            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px 0' }}>Total Services</p>
              <p style={{ color: '#6ee7b7', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {stats?.totalServices || 0}
              </p>
            </div>

            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px 0' }}>Blocked Rate</p>
              <p style={{ color: '#f87171', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {stats?.totalUsers ? Math.round((stats.blockedUsers / stats.totalUsers) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AnalyticsPage;
