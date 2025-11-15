/**
 * Role Model - Production Grade RBAC
 * Represents user roles in the system with hierarchical support
 */
export default (sequelize: any, DataType: any) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Human-readable role name',
      },
      slug: {
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'URL-friendly identifier for the role (e.g., "super-admin", "content-editor")',
      },
      description: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Detailed description of role responsibilities and permissions',
      },
      priority: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Role hierarchy level - higher number = higher priority (e.g., Admin=100, User=1)',
      },
      isSystem: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System roles cannot be deleted (e.g., SuperAdmin, Guest)',
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Inactive roles cannot be assigned to users',
      },
      maxUsers: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'Maximum number of users that can have this role (null = unlimited)',
      },
      parentRoleId: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'Parent role ID for hierarchical role inheritance',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata (features, limits, custom settings)',
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'Optional expiration date for temporary/promotional roles',
      },
      createdBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who created this role',
      },
      updatedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who last updated this role',
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Role',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
        {
          unique: true,
          fields: ['slug'],
        },
        {
          fields: ['priority'],
          name: 'idx_role_priority',
        },
        {
          fields: ['isActive'],
          name: 'idx_role_active',
        },
        {
          fields: ['parentRoleId'],
          name: 'idx_role_parent',
        },
        {
          fields: ['createdAt'],
          name: 'idx_role_created',
        },
      ],
    },
  );

  Role.associate = (models: any) => {
    // Users with this role
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });

    // Many-to-Many with Permissions through RolePermission
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });

    // Self-referencing for role hierarchy
    Role.hasMany(models.Role, {
      foreignKey: 'parentRoleId',
      as: 'childRoles',
    });

    Role.belongsTo(models.Role, {
      foreignKey: 'parentRoleId',
      as: 'parentRole',
    });

    // User assignments tracking
    Role.hasMany(models.UserRole, {
      foreignKey: 'roleId',
      as: 'userRoleAssignments',
    });

    // Audit trail
    Role.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });

    Role.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
  };

  return Role;
};
