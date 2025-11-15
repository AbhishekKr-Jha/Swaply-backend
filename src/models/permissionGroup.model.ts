export default (sequelize: any, DataType: any) => {
  const PermissionGroup = sequelize.define(
    'PermissionGroup',
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
        comment: 'Group name (e.g., "User Management", "Content Operations")',
      },
      description: {
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Detailed description of what permissions this group contains',
      },
      icon: {
        type: DataType.STRING(50),
        allowNull: true,
        comment: 'Icon identifier for UI display',
      },
      color: {
        type: DataType.STRING(20),
        allowNull: true,
        comment: 'Color code for UI categorization',
      },
      category: {
        type: DataType.STRING(50),
        allowNull: true,
        comment: 'Higher-level category (e.g., "System", "Business", "Content")',
      },
      displayOrder: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Order for displaying in UI',
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: DataType.JSON,
        allowNull: true,
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'PermissionGroup',
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
          fields: ['category'],
          name: 'idx_pg_category',
        },
        {
          fields: ['displayOrder'],
          name: 'idx_pg_order',
        },
      ],
    },
  );

  PermissionGroup.associate = (models: any) => {
    PermissionGroup.hasMany(models.Permission, {
      foreignKey: 'permissionGroupId',
      as: 'permissions',
    });
  };

  return PermissionGroup;
};
