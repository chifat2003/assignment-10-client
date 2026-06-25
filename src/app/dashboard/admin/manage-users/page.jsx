'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/app/hooks/useAdmin';
import { AdminGuard } from '@/app/components/AdminGuard';

const ManageUsersPage = () => {
  const { fetchAllUsers, setUserRole, toggleBlockUser, loading, error } = useAdmin();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data || []);
        setFilteredUsers(data || []);
      } catch (err) {
        console.error('Error loading users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await setUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setSuccessMessage(`User role updated to ${newRole}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleToggleBlock = async (userId, currentBlockStatus) => {
    try {
      await toggleBlockUser(userId, !currentBlockStatus);
      setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: !currentBlockStatus } : u)));
      setSuccessMessage(`User ${!currentBlockStatus ? 'blocked' : 'unblocked'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error toggling block:', err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#f59e0b';
      case 'lawyer':
        return '#8b5cf6';
      case 'user':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <div style={{ padding: '24px' }}>Loading users...</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div style={{ padding: '24px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
            Manage Users
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Manage user roles and status ({filteredUsers.length} users)
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px',
              background: '#1a1a2e',
              border: '1px solid #3b4256',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              background: '#1a1a2e',
              border: '1px solid #3b4256',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="lawyer">Lawyers</option>
            <option value="user">Users</option>
          </select>
        </div>

        {/* Users Table */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #3b4256',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #3b4256', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>
                    Email
                  </th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>
                    Name
                  </th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>
                    Role
                  </th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>
                    Status
                  </th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: index !== filteredUsers.length - 1 ? '1px solid #3b4256' : 'none',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#e5e7eb' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#9ca3af' }}>
                        {user.name || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: `1px solid ${getRoleColor(user.role)}`,
                            borderRadius: '4px',
                            color: getRoleColor(user.role),
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="user">User</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <span
                          style={{
                            background: user.isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: user.isBlocked ? '#ef4444' : '#10b981',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <button
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          style={{
                            padding: '6px 12px',
                            background: user.isBlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            border: `1px solid ${user.isBlocked ? '#10b981' : '#ef4444'}`,
                            borderRadius: '4px',
                            color: user.isBlocked ? '#6ee7b7' : '#f87171',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              padding: 12px 10px !important;
            }
          }
        `}</style>
      </div>
    </AdminGuard>
  );
};

export default ManageUsersPage;
