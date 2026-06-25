'use client';

import { createContext, useContext } from 'react';
import { isAdmin } from '@/lib/roles';

const AdminContext = createContext();

export const AdminProvider = ({ children, session }) => {
  const isUserAdmin = session?.user ? isAdmin(session.user) : false;

  const value = {
    isAdmin: isUserAdmin,
    user: session?.user,
    canAccess: isUserAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
