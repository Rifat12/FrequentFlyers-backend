"use strict";

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('Airport', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                validate: {
                    notEmpty: true
                }
            },
            airport: {
                type: DataTypes.STRING
            },
            city: {
                type: DataTypes.STRING
            },
            country: {
                type: DataTypes.STRING
            },
            iata: {
                type: DataTypes.STRING
            },
            multiCode: {
                type: DataTypes.STRING
            },
            icao: {
                type: DataTypes.STRING
            },
            altitude: {
                type: DataTypes.STRING,
            },
            timeZone: {
                type: DataTypes.STRING,
            },
            dstTimeZone: {
                type: DataTypes.STRING,
            },
            timeZoneName: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: 'airport',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};
