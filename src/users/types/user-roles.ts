export const userRoles = ['admin', 'regular'] as const;

export type UserRole = (typeof userRoles)[number];
