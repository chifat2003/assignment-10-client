'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { isAdmin } from '@/lib/roles';
import { LoadingSpinner } from './LoadingSpinner';

export const AdminGuard = ({ children }) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace('/signin');
        return;
      }

      if (!isAdmin(session.user)) {
        // Redirect non-admin users based on their role
        if (session.user.role === 'lawyer') {
          router.replace('/dashboard/lawyer');
        } else {
          router.replace('/dashboard/user');
        }
        return;
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <LoadingSpinner size="lg" />;
  }

  if (!session?.user || !isAdmin(session.user)) {
    return null;
  }

  return children;
};
