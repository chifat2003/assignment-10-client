// Role definitions and constants
export const USER_ROLES = {
    ADMIN: 'admin',
    LAWYER: 'lawyer',
    USER: 'user',
};

// Role hierarchy - higher number = more permissions
export const ROLE_HIERARCHY = {
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.LAWYER]: 2,
    [USER_ROLES.USER]: 1,
};

// Role descriptions
export const ROLE_DESCRIPTIONS = {
    [USER_ROLES.ADMIN]: 'Platform administrator with full access',
    [USER_ROLES.LAWYER]: 'Legal professional providing services',
    [USER_ROLES.USER]: 'Regular user seeking legal services',
};

// Check if user has a specific role
export const hasRole = (user, role) => {
    if (!user) return false;
    return user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
    if (!user) return false;
    return roles.includes(user.role);
};

// Check if user has admin role
export const isAdmin = (user) => {
    return hasRole(user, USER_ROLES.ADMIN);
};

// Check if user has lawyer role
export const isLawyer = (user) => {
    return hasRole(user, USER_ROLES.LAWYER);
};

// Check if user role hierarchy is equal or higher than required role
export const hasRoleHierarchy = (user, requiredRole) => {
    if (!user) return false;
    return (ROLE_HIERARCHY[user.role] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};
