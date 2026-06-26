'use client';

import { useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { isAdmin } from '@/lib/roles';

// Always use the Next.js API routes — they share the same better-auth session
const API_BASE_URL = '';

export const useAdmin = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isUserAdmin = session?.user ? isAdmin(session.user) : false;

  const setUserRole = useCallback(
    async (userId, role) => {
      if (!isUserAdmin) {
        setError('Not authorized to perform this action');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/set-role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId, role }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update user role');
        }

        return await response.json();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isUserAdmin]
  );

  const toggleBlockUser = useCallback(
    async (userId, isBlocked) => {
      if (!isUserAdmin) {
        setError('Not authorized to perform this action');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/toggle-block`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId, isBlocked }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update user block status');
        }

        return await response.json();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isUserAdmin]
  );

  const fetchAdminStats = useCallback(async () => {
    if (!isUserAdmin) {
      setError('Not authorized to perform this action');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isUserAdmin]);

  const fetchAllUsers = useCallback(async () => {
    if (!isUserAdmin) {
      setError('Not authorized to perform this action');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isUserAdmin]);

  const fetchAllTransactions = useCallback(async () => {
    if (!isUserAdmin) {
      setError('Not authorized to perform this action');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/transactions`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isUserAdmin]);

  return {
    isAdmin: isUserAdmin,
    user: session?.user,
    loading,
    error,
    setUserRole,
    toggleBlockUser,
    fetchAdminStats,
    fetchAllUsers,
    fetchAllTransactions,
  };
};
