"use strict";

module.exports = (sequelize, DataTypes) => {
  const FlightOffer = sequelize.define(
    "flightOffer",
    {
      flightID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "trips",
          key: "id",
        },
      },
      offer: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      pnr: {
        type: DataTypes.STRING,
      },
      ticketNo: {
        type: DataTypes.STRING,
      },
      passengers: {
        type: DataTypes.JSONB,
        allowNull: true
      },
    },
    {
      tableName: "flightOffers",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          using: 'gin',
          fields: ['offer']
        },
        {
          using: 'gin',
          fields: ['passengers'] 
        }
      ]
    }
  );

  FlightOffer.associate = (models) => {
    FlightOffer.belongsTo(models.trip, {
      foreignKey: "tripId",
      as: "trip",
    });
    // ...other associations...
  };

  return FlightOffer;
};
