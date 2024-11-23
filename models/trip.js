"use strict";

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    "trip",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      tableName: "trips",
      timestamps: true,
      underscored: true,
    }
  );

  Trip.associate = (models) => {
    Trip.hasMany(models.event, {
      foreignKey: 'tripId',
      as: 'events'
    });
    Trip.hasMany(models.flightOffer, {
      foreignKey: 'tripId',
      as: 'flightOffers'
    });
    // ...other associations...
  };

  return Trip;
};
