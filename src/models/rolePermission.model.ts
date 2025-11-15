export default (sequelize: any, DataType: any) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'Permission',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isGranted: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'True = granted, False = explicitly denied (overrides grants)',
      },
      conditions: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Custom conditions for this specific role-permission (time windows, IP restrictions, etc.)',
      },
      constraints: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional constraints (max operations per day, resource limits, etc.)',
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'Temporary permission assignment expiration',
      },
      effectiveFrom: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this permission becomes active for the role',
      },
      priority: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Priority for conflict resolution when multiple roles have different grants',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata',
      },
      grantedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who granted this permission',
      },
      grantedAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this permission was granted',
      },
      revokedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who revoked/denied this permission',
      },
      revokedAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this permission was revoked',
      },
      reason: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Reason for granting or revoking this permission',
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'RolePermission',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['roleId', 'permissionId'],
          name: 'unique_role_permission',
        },
        {
          fields: ['roleId'],
          name: 'idx_rp_role',
        },
        {
          fields: ['permissionId'],
          name: 'idx_rp_permission',
        },
        {
          fields: ['isGranted'],
          name: 'idx_rp_granted',
        },
        {
          fields: ['expiresAt'],
          name: 'idx_rp_expires',
        },
        {
          fields: ['effectiveFrom'],
          name: 'idx_rp_effective',
        },
        {
          fields: ['priority'],
          name: 'idx_rp_priority',
        },
      ],
    },
  );

  RolePermission.associate = (models: any) => {
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    RolePermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });

    RolePermission.belongsTo(models.User, {
      foreignKey: 'grantedBy',
      as: 'granter',
    });

    RolePermission.belongsTo(models.User, {
      foreignKey: 'revokedBy',
      as: 'revoker',
    });
  };

  return RolePermission;
};
