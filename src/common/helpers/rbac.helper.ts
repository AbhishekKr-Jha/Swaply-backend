import type { ResponseToolkit } from '@hapi/hapi';

// Types for RBAC operations
export interface PermissionCheck {
  resource: string;
  action: string;
  scope?: string;
  userId: number;
}

export interface RolePermissions {
  roleId: number;
  permissions: Array<{
    id: number;
    slug: string;
    resource: string;
    action: string;
    scope: string;
    isGranted: boolean;
  }>;
}

export const hasPermission = async (models: any, check: PermissionCheck): Promise<boolean> => {
  const { userId, resource, action, scope = 'own' } = check;

  // 1. Check direct user permissions (highest priority)
  const userPermission = await models.UserPermission.findOne({
    where: {
      userId,
      isActive: true,
    },
    include: [
      {
        model: models.Permission,
        as: 'permission',
        where: {
          resource,
          action,
          isActive: true,
        },
      },
    ],
  });

  if (userPermission) {
    // If explicitly denied, return false immediately
    if (!userPermission.isGranted || userPermission.overrideType === 'deny') {
      return false;
    }
    // Check scope if provided
    if (userPermission.scope && userPermission.scope !== scope) {
      return false;
    }
    return true;
  }

  // 2. Check role-based permissions
  const user = await models.User.findByPk(userId, {
    include: [
      {
        model: models.UserRole,
        as: 'userRoleAssignments',
        where: {
          isActive: true,
        },
        include: [
          {
            model: models.Role,
            as: 'role',
            where: {
              isActive: true,
            },
            include: [
              {
                model: models.Permission,
                as: 'permissions',
                where: {
                  resource,
                  action,
                  isActive: true,
                },
                through: {
                  where: {
                    isGranted: true,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user || !user.userRoleAssignments || user.userRoleAssignments.length === 0) {
    return false;
  }

  // Check if any role grants the permission
  for (const userRole of user.userRoleAssignments) {
    if (userRole.role && userRole.role.permissions && userRole.role.permissions.length > 0) {
      return true;
    }
  }

  return false;
};

export const getUserPermissions = async (models: any, userId: number): Promise<string[]> => {
  const permissions = new Set<string>();

  // Get role-based permissions
  const user = await models.User.findByPk(userId, {
    include: [
      {
        model: models.UserRole,
        as: 'userRoleAssignments',
        where: {
          isActive: true,
        },
        include: [
          {
            model: models.Role,
            as: 'role',
            where: {
              isActive: true,
            },
            include: [
              {
                model: models.Permission,
                as: 'permissions',
                where: {
                  isActive: true,
                },
                through: {
                  where: {
                    isGranted: true,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (user && user.userRoleAssignments) {
    for (const userRole of user.userRoleAssignments) {
      if (userRole.role && userRole.role.permissions) {
        for (const permission of userRole.role.permissions) {
          permissions.add(permission.slug);
        }
      }
    }
  }

  // Get direct user permissions
  const userPermissions = await models.UserPermission.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: models.Permission,
        as: 'permission',
        where: {
          isActive: true,
        },
      },
    ],
  });

  for (const up of userPermissions) {
    if (up.isGranted && up.permission) {
      permissions.add(up.permission.slug);
    } else if (!up.isGranted && up.permission) {
      // Explicit deny - remove from permissions
      permissions.delete(up.permission.slug);
    }
  }

  return Array.from(permissions);
};

export const hasAnyRole = async (models: any, userId: number, roleSlugs: string[]): Promise<boolean> => {
  const userRoles = await models.UserRole.findAll({
    where: {
      userId,
      isActive: true,
    },
    include: [
      {
        model: models.Role,
        as: 'role',
        where: {
          slug: roleSlugs,
          isActive: true,
        },
      },
    ],
  });

  return userRoles.length > 0;
};

export const hasAllRoles = async (models: any, userId: number, roleSlugs: string[]): Promise<boolean> => {
  const userRoles = await models.UserRole.findAll({
    where: {
      userId,
      isActive: true,
    },
    include: [
      {
        model: models.Role,
        as: 'role',
        where: {
          slug: roleSlugs,
          isActive: true,
        },
      },
    ],
  });

  return userRoles.length === roleSlugs.length;
};

export const assignRole = async (
  models: any,
  userId: number,
  roleId: number,
  assignedBy: number,
  options: {
    isPrimary?: boolean;
    expiresAt?: Date;
    effectiveFrom?: Date;
    reason?: string;
    metadata?: any;
  } = {},
): Promise<any> => {
  // Create user role assignment
  const userRole = await models.UserRole.create({
    userId,
    roleId,
    assignedBy,
    isPrimary: options.isPrimary || false,
    expiresAt: options.expiresAt,
    effectiveFrom: options.effectiveFrom,
    reason: options.reason,
    metadata: options.metadata,
  });

  // Create audit log
  await models.AuditLog.create({
    entityType: 'user_role',
    entityId: userRole.id,
    action: 'grant',
    actorId: assignedBy,
    targetUserId: userId,
    changes: {
      roleId,
      isPrimary: options.isPrimary,
    },
    reason: options.reason,
    severity: 'medium',
    isSuccessful: true,
  });

  return userRole;
};

export const revokeRole = async (
  models: any,
  userId: number,
  roleId: number,
  revokedBy: number,
  reason?: string,
): Promise<void> => {
  const userRole = await models.UserRole.findOne({
    where: {
      userId,
      roleId,
      isActive: true,
    },
  });

  if (userRole) {
    await userRole.update({
      isActive: false,
      revokedBy,
      revokedAt: new Date(),
      reason,
    });

    // Create audit log
    await models.AuditLog.create({
      entityType: 'user_role',
      entityId: userRole.id,
      action: 'revoke',
      actorId: revokedBy,
      targetUserId: userId,
      changes: {
        roleId,
        isActive: false,
      },
      reason,
      severity: 'medium',
      isSuccessful: true,
    });
  }
};

export const grantUserPermission = async (
  models: any,
  userId: number,
  permissionId: number,
  grantedBy: number,
  options: {
    overrideType?: 'grant' | 'deny';
    scope?: string;
    expiresAt?: Date;
    reason?: string;
  } = {},
): Promise<any> => {
  const userPermission = await models.UserPermission.create({
    userId,
    permissionId,
    grantedBy,
    isGranted: options.overrideType !== 'deny',
    overrideType: options.overrideType || 'grant',
    scope: options.scope,
    expiresAt: options.expiresAt,
    reason: options.reason,
  });

  // Create audit log
  await models.AuditLog.create({
    entityType: 'user_permission',
    entityId: userPermission.id,
    action: 'grant',
    actorId: grantedBy,
    targetUserId: userId,
    changes: {
      permissionId,
      overrideType: options.overrideType,
    },
    reason: options.reason,
    severity: 'high',
    isSuccessful: true,
  });

  return userPermission;
};

export const requirePermission = (resource: string, action: string) => {
  return async (request: any, h: ResponseToolkit) => {
    const userId = request.auth?.credentials?.userId;

    if (!userId) {
      return h.response({ message: 'Unauthorized' }).code(401).takeover();
    }

    const models = request.server.app.models;
    const hasAccess = await hasPermission(models, { userId, resource, action });

    if (!hasAccess) {
      return h.response({ message: 'Forbidden: Insufficient permissions' }).code(403).takeover();
    }

    return h.continue;
  };
};

export const requireRole = (roleSlugs: string[]) => {
  return async (request: any, h: ResponseToolkit) => {
    const userId = request.auth?.credentials?.userId;

    if (!userId) {
      return h.response({ message: 'Unauthorized' }).code(401).takeover();
    }

    const models = request.server.app.models;
    const hasAccess = await hasAnyRole(models, userId, roleSlugs);

    if (!hasAccess) {
      return h.response({ message: 'Forbidden: Required role not found' }).code(403).takeover();
    }

    return h.continue;
  };
};
