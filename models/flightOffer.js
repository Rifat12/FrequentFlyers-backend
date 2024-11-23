
"use strict";

module.exports = (sequelize, DataTypes) => {
  const FlightOffer = sequelize.define(
    "flightOffer",
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
    },
    {
      tableName: "flightOffers",
      timestamps: true,
      underscored: true,
    }
  );

  FlightOffer.associate = (models) => {
    FlightOffer.belongsTo(models.trip, {
      foreignKey: 'tripId',
      as: 'trip'
    });
    // ...other associations...
  };

  return FlightOffer;
};