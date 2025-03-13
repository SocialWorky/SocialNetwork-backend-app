export enum Role {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

// Jerarquía de roles (de menor a mayor privilegio)
export const RoleHierarchy = {
  [Role.USER]: [Role.USER, Role.EDITOR, Role.ADMIN],
  [Role.EDITOR]: [Role.EDITOR, Role.ADMIN],
  [Role.ADMIN]: [Role.ADMIN],
};
