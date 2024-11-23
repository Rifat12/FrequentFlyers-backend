"use strict";

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "event",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
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
      tableName: "events",
      timestamps: true,
      underscored: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.trip, {
      foreignKey: 'tripId',
      as: 'trip'
    });
  };

  return Event;
};
