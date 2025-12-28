'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuditLog', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entityType: {
        type: Sequelize.ENUM('role', 'permission', 'user_role', 'user_permission', 'role_permission'),
        allowNull: false,
        comment: 'Type of entity that was modified',
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID of the entity that was modified',
      },
      action: {
        type: Sequelize.ENUM('create', 'update', 'delete', 'grant', 'revoke', 'activate', 'deactivate'),
        allowNull: false,
        comment: 'Action performed',
      },
      actorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who performed the action (null for system actions)',
      },
      targetUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID affected by this action (if applicable)',
      },
      changes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Before/after values of changed fields',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional context (IP address, user agent, request ID, etc.)',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason provided for the action',
      },
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address from which action was performed',
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent string',
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
        comment: 'Severity level for security monitoring',
      },
      isSuccessful: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the action was successful',
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Error message if action failed',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('AuditLog');
  },
};
