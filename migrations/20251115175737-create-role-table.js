'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Human-readable role name',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Detailed description of role responsibilities and permissions',
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Role hierarchy level - higher number = higher priority (e.g., Admin=100, User=1)',
      },
      isSystem: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System roles cannot be deleted (e.g., SuperAdmin, Guest)',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Inactive roles cannot be assigned to users',
      },
      maxUsers: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Maximum number of users that can have this role (null = unlimited)',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata (features, limits, custom settings)',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Optional expiration date for temporary/promotional roles',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who created this role',
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who last updated this role',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('Role', ['name'], {
      unique: true,
      name: 'idx_role_name_unique',
    });
    await queryInterface.addIndex('Role', ['priority'], {
      name: 'idx_role_priority',
    });
    await queryInterface.addIndex('Role', ['isActive'], {
      name: 'idx_role_isActive',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Role');
  },
};
