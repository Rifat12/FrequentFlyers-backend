"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "auth",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.STRING,
      },

      client_id: {
        type: DataTypes.STRING,
      },
      token_type: {
        type: DataTypes.STRING,
      },
      expires_in: {
        type: DataTypes.STRING,
      },
      access_token: {
        type: DataTypes.STRING,
      },
      extraParams: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "auth",

      freezeTableName: true,

      timestamps: false,

      underscored: true,
    }
  );
};
