'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Human-readable permission name (e.g., "Edit User Profile")',
      },
      resource: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Resource type (e.g., "user", "product", "order", "payment")',
      },
      action: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM('own', 'team', 'department', 'organization', 'all'),
        allowNull: false,
        defaultValue: 'own',
        comment: 'Scope of permission - what data can be accessed',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Detailed description of what this permission allows',
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Permission category for grouping (e.g., "User Management", "Content", "Financial")',
      },
      permissionGroupId: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System permissions cannot be deleted',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Inactive permissions are not enforced',
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Priority for permission evaluation (higher = evaluated first)',
      },
      conditions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Advanced conditions for permission (time-based, IP-based, etc.)',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata for custom permission logic',
      },
      riskLevel: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
        comment: 'Risk assessment level for audit and compliance',
      },
      requiresMFA: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this permission requires multi-factor authentication',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Optional expiration date for temporary permissions',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who created this permission',
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who last updated this permission',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('Permission', ['resource', 'action', 'scope'], {
      name: 'idx_permission_ras',
    });
    await queryInterface.addIndex('Permission', ['isActive'], {
      name: 'idx_permission_isActive',
    });
    await queryInterface.addIndex('Permission', ['priority'], {
      name: 'idx_permission_priority',
    });
    await queryInterface.addIndex('Permission', ['riskLevel'], {
      name: 'idx_permission_riskLevel',
    });
    await queryInterface.addIndex('Permission', ['category'], {
      name: 'idx_permission_category',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Permission');
  },
};
