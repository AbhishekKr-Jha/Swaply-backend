export default (sequelize: any, DataType: any) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entityType: {
        type: DataType.ENUM('role', 'permission', 'user_role', 'user_permission', 'role_permission'),
        allowNull: false,
        comment: 'Type of entity that was modified',
      },
      entityId: {
        type: DataType.INTEGER,
        allowNull: false,
        comment: 'ID of the entity that was modified',
      },
      action: {
        type: DataType.ENUM('create', 'update', 'delete', 'grant', 'revoke', 'activate', 'deactivate'),
        allowNull: false,
        comment: 'Action performed',
      },
      actorId: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID who performed the action (null for system actions)',
      },
      targetUserId: {
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'User ID affected by this action (if applicable)',
      },
      changes: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Before/after values of changed fields',
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
        comment: 'Additional context (IP address, user agent, request ID, etc.)',
      },
      reason: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Reason provided for the action',
      },
      ipAddress: {
        type: DataType.STRING(45),
        allowNull: true,
        comment: 'IP address from which action was performed',
      },
      userAgent: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'User agent string',
      },
      severity: {
        type: DataType.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
        comment: 'Severity level for security monitoring',
      },
      isSuccessful: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the action was successful',
      },
      errorMessage: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Error message if action failed',
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'AuditLog',
      timestamps: true,
      indexes: [
        {
          fields: ['entityType', 'entityId'],
          name: 'idx_audit_entity',
        },
        {
          fields: ['actorId'],
          name: 'idx_audit_actor',
        },
        {
          fields: ['targetUserId'],
          name: 'idx_audit_target',
        },
        {
          fields: ['action'],
          name: 'idx_audit_action',
        },
        {
          fields: ['createdAt'],
          name: 'idx_audit_created',
        },
        {
          fields: ['severity'],
          name: 'idx_audit_severity',
        },
        {
          fields: ['isSuccessful'],
          name: 'idx_audit_success',
        },
      ],
    },
  );

  AuditLog.associate = (models: any) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'actorId',
      as: 'actor',
    });

    AuditLog.belongsTo(models.User, {
      foreignKey: 'targetUserId',
      as: 'targetUser',
    });
  };

  return AuditLog;
};
