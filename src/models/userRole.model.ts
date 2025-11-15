export default (sequelize: any, DataType: any) => {
  const UserRole = sequelize.define(
    'UserRole',
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
      roleId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Prevent deletion of roles that are assigned
      },
      isPrimary: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Indicates if this is the user's primary role",
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this role assignment is currently active',
      },
      effectiveFrom: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this role assignment becomes active',
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this role assignment expires',
      },
      assignedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who assigned this role',
      },
      assignedAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        comment: 'When this role was assigned',
      },
      revokedBy: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who revoked this role',
      },
      revokedAt: {
        type: DataType.DATE,
        allowNull: true,
        comment: 'When this role was revoked',
      },
      reason: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Reason for role assignment or revocation',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional context for the role assignment',
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'UserRole',
      timestamps: true,
      indexes: [
        {
          fields: ['userId', 'roleId'],
          name: 'idx_user_role_composite',
        },
        {
          fields: ['userId'],
          name: 'idx_ur_user',
        },
        {
          fields: ['roleId'],
          name: 'idx_ur_role',
        },
        {
          fields: ['isPrimary'],
          name: 'idx_ur_primary',
        },
        {
          fields: ['isActive'],
          name: 'idx_ur_active',
        },
        {
          fields: ['effectiveFrom'],
          name: 'idx_ur_effective',
        },
        {
          fields: ['expiresAt'],
          name: 'idx_ur_expires',
        },
      ],
    },
  );

  UserRole.associate = (models: any) => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    UserRole.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    UserRole.belongsTo(models.User, {
      foreignKey: 'assignedBy',
      as: 'assigner',
    });

    UserRole.belongsTo(models.User, {
      foreignKey: 'revokedBy',
      as: 'revoker',
    });
  };

  return UserRole;
};
