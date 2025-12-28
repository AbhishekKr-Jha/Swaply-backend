'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Permission',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isGranted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'True = granted, False = explicitly denied (overrides grants)',
      },
      conditions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Custom conditions for this specific role-permission (time windows, IP restrictions, etc.)',
      },
      constraints: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional constraints (max operations per day, resource limits, etc.)',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Temporary permission assignment expiration',
      },
      effectiveFrom: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this permission becomes active for the role',
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Priority for conflict resolution when multiple roles have different grants',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional flexible metadata',
      },
      grantedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who granted this permission',
      },
      grantedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this permission was granted',
      },
      revokedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who revoked/denied this permission',
      },
      revokedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this permission was revoked',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for granting or revoking this permission',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RolePermission');
  },
};
