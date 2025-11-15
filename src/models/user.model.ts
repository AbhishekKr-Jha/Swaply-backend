export default (sequelize: any, DataType: any) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
      },
      primaryPhoneNumber: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
      },
      secondaryPhoneNumber: {
        type: DataType.STRING,
        allowNull: true,
      },
      rate: {
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
      },
      username: {
        type: DataType.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      roleId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      isSuperAdmin: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment:
          'Indicates if the user has super admin privileges & can bypass role/permission checks & do anything without any checks or anything',
      },
      locationGeo: {
        type: DataType.GEOMETRY('POINT'),
        allowNull: true,
        validate: {
          isValidCoordinates(value: unknown) {
            if (value && typeof value === 'object' && value !== null) {
              const geoValue = value as { coordinates?: number[] };
              if (!geoValue.coordinates || geoValue.coordinates.length !== 2) {
                throw new Error('locationGeo must have valid coordinates [longitude, latitude]');
              }
              const [lng, lat] = geoValue.coordinates;
              if (lng < -180 || lng > 180) {
                throw new Error('Longitude must be between -180 and 180');
              }
              if (lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90');
              }
            }
          },
        },
      },
      latitude: {
        type: DataType.DECIMAL(10, 8),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: DataType.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
      locationText: {
        type: DataType.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reputationScore: {
        type: DataType.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      bio: {
        type: DataType.STRING(355),
        allowNull: true,
      },
      profilePictureUrl: {
        type: DataType.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'User',
      timestamps: true,
      indexes: [
        {
          fields: ['locationGeo'],
          type: 'SPATIAL',
        },
        {
          fields: ['latitude', 'longitude'],
          name: 'lat_lng_index',
        },
      ],
    },
  );

  User.associate = (models: any) => {
    // Primary role relationship (single role via roleId FK)
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    // Multiple roles through UserRole (for multi-role support)
    User.hasMany(models.UserRole, {
      foreignKey: 'userId',
      as: 'userRoleAssignments',
    });

    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles',
    });

    // Direct user permissions (override role permissions)
    User.hasMany(models.UserPermission, {
      foreignKey: 'userId',
      as: 'userPermissionAssignments',
    });

    User.belongsToMany(models.Permission, {
      through: models.UserPermission,
      foreignKey: 'userId',
      otherKey: 'permissionId',
      as: 'permissions',
    });

    // Refresh tokens for authentication
    User.hasMany(models.RefreshToken, {
      foreignKey: 'userId',
      as: 'refreshTokens',
    });

    // User skills
    User.hasMany(models.Skill, {
      foreignKey: 'userId',
      as: 'skills',
    });

    // Audit logs where user is the actor
    User.hasMany(models.AuditLog, {
      foreignKey: 'actorId',
      as: 'actionsPerformed',
    });

    // Audit logs where user is the target
    User.hasMany(models.AuditLog, {
      foreignKey: 'targetUserId',
      as: 'actionsReceived',
    });

    // Role assignments made by this user
    User.hasMany(models.UserRole, {
      foreignKey: 'assignedBy',
      as: 'roleAssignmentsGranted',
    });

    // Role revocations made by this user
    User.hasMany(models.UserRole, {
      foreignKey: 'revokedBy',
      as: 'roleAssignmentsRevoked',
    });

    // Permission grants made by this user
    User.hasMany(models.UserPermission, {
      foreignKey: 'grantedBy',
      as: 'permissionsGranted',
    });

    // Permission revocations made by this user
    User.hasMany(models.UserPermission, {
      foreignKey: 'revokedBy',
      as: 'permissionsRevoked',
    });

    // RolePermission grants made by this user
    User.hasMany(models.RolePermission, {
      foreignKey: 'grantedBy',
      as: 'rolePermissionsGranted',
    });

    // RolePermission revocations made by this user
    User.hasMany(models.RolePermission, {
      foreignKey: 'revokedBy',
      as: 'rolePermissionsRevoked',
    });

    // Roles created by this user
    User.hasMany(models.Role, {
      foreignKey: 'createdBy',
      as: 'rolesCreated',
    });

    // Roles updated by this user
    User.hasMany(models.Role, {
      foreignKey: 'updatedBy',
      as: 'rolesUpdated',
    });

    // Permissions created by this user
    User.hasMany(models.Permission, {
      foreignKey: 'createdBy',
      as: 'permissionsCreated',
    });

    // Permissions updated by this user
    User.hasMany(models.Permission, {
      foreignKey: 'updatedBy',
      as: 'permissionsUpdated',
    });
  };

  return User;
};
