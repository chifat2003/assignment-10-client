import { isAdmin, hasRole } from './roles';

// Higher-order component to protect routes for admin users
export const withAdminProtection = (Component) => {
  return function AdminProtectedComponent(props) {
    const { data: session, isPending } = props.sessionData || {};

    if (isPending) {
      return <div>Loading...</div>;
    }

    if (!session?.user) {
      // Redirect will be handled by the component
      return null;
    }

    if (!isAdmin(session.user)) {
      // Redirect will be handled by the component
      return null;
    }

    return <Component {...props} />;
  };
};

// Utility to check if user can access admin features
export const canAccessAdmin = (user) => {
  return isAdmin(user);
};

// Utility to check if user can perform admin action
export const canPerformAdminAction = (user) => {
  return isAdmin(user);
};

// Utility to check if user can manage users
export const canManageUsers = (user) => {
  return isAdmin(user);
};

// Utility to check if user can manage transactions
export const canManageTransactions = (user) => {
  return isAdmin(user);
};

// Utility to check if user can view analytics
export const canViewAnalytics = (user) => {
  return isAdmin(user);
};

// Utility to check if user can manage content
export const canManageContent = (user) => {
  return isAdmin(user);
};

// Utility to check if user can manage other admins
export const canManageAdmins = (user) => {
  return isAdmin(user);
};
