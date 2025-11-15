'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      primaryPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      secondaryPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment:
          'Indicates if the user has super admin privileges & can bypass role/permission checks & do anything without any checks or anything',
      },
      locationGeo: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
        validate: {
          isValidCoordinates(value) {
            if (value && typeof value === 'object' && value !== null) {
              const geoValue = value;
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
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
      locationText: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reputationScore: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      bio: {
        type: Sequelize.STRING(355),
        allowNull: true,
      },
      birthInfo: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      profilePictureUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add composite index for latitude and longitude
    await queryInterface.addIndex('User', ['latitude', 'longitude'], {
      name: 'lat_lng_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('User');
  },
};
