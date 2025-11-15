export default (sequelize: any, DataType: any) => {
  const Permission = sequelize.define(
    'Permission',
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
        comment: 'Human-readable permission name (e.g., "Edit User Profile")',
      },
      resource: {
        type: DataType.STRING(50),
        allowNull: false,
        comment: 'Resource type (e.g., "user", "product", "order", "payment")',
      },
      action: {
        type: DataType.ENUM(
          'create',
          'read',
          'update',
          'delete',
          'list',
          'export',
          'import',
          'approve',
          'reject',
          'publish',
          'archive',
          'restore',
          'manage',
        ),
        allowNull: false,
        comment: 'Action allowed on the resource',
      },
      scope: {
        type: DataType.ENUM('own', 'team', 'department', 'organization', 'all'),
        allowNull: false,
        defaultValue: 'own',
        comment: 'Scope of permission - what data can be accessed',
      },
      description: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Detailed description of what this permission allows',
      },
      category: {
        type: DataType.STRING(50),
        allowNull: true,
        comment: 'Permission category for grouping (e.g., "User Management", "Content", "Financial")',
      },
      permissionGroupId: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
          model: 'PermissionGroup',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // If group is deleted, set permissionGroupId to NULL
        comment: 'Foreign key to the PermissionGroup model for UI organization.',
      },
      isSystem: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System permissions cannot be deleted',
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Inactive permissions are not enforced',
      },
      priority: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Priority for permission evaluation (higher = evaluated first)',
      },
      conditions: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Advanced conditions for permission (time-based, IP-based, etc.)',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata for custom permission logic',
      },
      riskLevel: {
        type: DataType.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
        comment: 'Risk assessment level for audit and compliance',
      },
      requiresMFA: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this permission requires multi-factor authentication',
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'Optional expiration date for temporary permissions',
      },
      createdBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who created this permission',
      },
      updatedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who last updated this permission',
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Permission',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['slug'],
        },
        {
          fields: ['resource', 'action', 'scope'],
          name: 'idx_permission_ras',
          comment: 'Composite index for Resource-Action-Scope pattern',
        },
        {
          fields: ['category'],
          name: 'idx_permission_category',
        },
        {
          fields: ['isActive'],
          name: 'idx_permission_active',
        },
        {
          fields: ['riskLevel'],
          name: 'idx_permission_risk',
        },
        {
          fields: ['priority'],
          name: 'idx_permission_priority',
        },
      ],
    },
  );

  Permission.associate = (models: any) => {
    // Many-to-Many with Roles through RolePermission
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });

    // Direct user permissions (override role permissions)
    Permission.belongsToMany(models.User, {
      through: models.UserPermission,
      foreignKey: 'permissionId',
      otherKey: 'userId',
      as: 'users',
    });

    // Audit trail
    Permission.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });

    Permission.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });

    // Permission dependencies (some permissions require others)
    Permission.belongsToMany(models.Permission, {
      through: 'PermissionDependency',
      foreignKey: 'permissionId',
      otherKey: 'requiredPermissionId',
      as: 'requiredPermissions',
    });
  };

  return Permission;
};
