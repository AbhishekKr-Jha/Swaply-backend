'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PermissionGroup', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Group name (e.g., "User Management", "Content Operations")',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Detailed description of what permissions this group contains',
      },
      icon: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Icon identifier for UI display',
      },
      color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Color code for UI categorization',
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Higher-level category (e.g., "System", "Business", "Content")',
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Order for displaying in UI',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('PermissionGroup');
  },
};
