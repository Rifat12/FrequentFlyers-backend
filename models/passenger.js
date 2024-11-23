"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "passenger",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      flightOfferId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'flight_offer',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      isUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "passengers",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    }
  );
};
