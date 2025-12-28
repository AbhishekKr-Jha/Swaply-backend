'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserPermission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
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
        comment: 'True = grant permission, False = explicitly deny (overrides role permissions)',
      },
      overrideType: {
        type: Sequelize.ENUM('grant', 'deny'),
        allowNull: false,
        defaultValue: 'grant',
        comment: 'Type of override - grant adds permission, deny removes it even if role has it',
      },
      scope: {
        type: Sequelize.ENUM('own', 'team', 'department', 'organization', 'all'),
        allowNull: true,
        comment: 'Override the default scope for this permission',
      },
      conditions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Custom conditions for this user permission',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this permission override expires',
      },
      effectiveFrom: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this permission override becomes active',
      },
      grantedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who granted this permission',
      },
      grantedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      revokedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who revoked this permission',
      },
      revokedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for granting or denying this permission',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UserPermission');
  },
};
