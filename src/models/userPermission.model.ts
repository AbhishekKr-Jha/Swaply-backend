export default (sequelize: any, DataType: any) => {
  const UserPermission = sequelize.define(
    'UserPermission',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
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
        comment: 'True = grant permission, False = explicitly deny (overrides role permissions)',
      },
      overrideType: {
        type: DataType.ENUM('grant', 'deny'),
        allowNull: false,
        defaultValue: 'grant',
        comment: 'Type of override - grant adds permission, deny removes it even if role has it',
      },
      scope: {
        type: DataType.ENUM('own', 'team', 'department', 'organization', 'all'),
        allowNull: true,
        comment: 'Override the default scope for this permission',
      },
      conditions: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Custom conditions for this user permission',
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this permission override expires',
      },
      effectiveFrom: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this permission override becomes active',
      },
      grantedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who granted this permission',
      },
      grantedAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
      },
      revokedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who revoked this permission',
      },
      revokedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
      reason: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Reason for granting or denying this permission',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'UserPermission',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'permissionId'],
          name: 'unique_user_permission',
        },
        {
          fields: ['userId'],
          name: 'idx_up_user',
        },
        {
          fields: ['permissionId'],
          name: 'idx_up_permission',
        },
        {
          fields: ['isGranted'],
          name: 'idx_up_granted',
        },
        {
          fields: ['overrideType'],
          name: 'idx_up_override',
        },
        {
          fields: ['expiresAt'],
          name: 'idx_up_expires',
        },
      ],
    },
  );

  UserPermission.associate = (models: any) => {
    UserPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });

    UserPermission.belongsTo(models.User, {
      foreignKey: 'grantedBy',
      as: 'granter',
    });

    UserPermission.belongsTo(models.User, {
      foreignKey: 'revokedBy',
      as: 'revoker',
    });
  };

  return UserPermission;
};
