/**
 * Created by asmsajib on 12/20/16.
 */

 "use strict";

module.exports = function(sequelize, DataTypes) {

    return sequelize.define('travellers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                notEmpty: true
            }
        },
        type: {
            type: DataTypes.STRING
        },
        bookingId: {
            type: DataTypes.INTEGER
        },
        titleName: {
            type: DataTypes.STRING
        },
        givenName: {
            type: DataTypes.STRING
        },
        surName: {
            type: DataTypes.STRING
        },
        nationality: {
            type: DataTypes.INTEGER
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        age: {
            type: DataTypes.INTEGER
        },
        gender: {
            type: DataTypes.DATE
        },
        travellerType: {
            type: DataTypes.ENUM,
            values: ['ADT', 'CHD', 'INF']
        },
        address1: {
            type: DataTypes.STRING
        },
        address2: {
            type: DataTypes.STRING
        },
        passportNumber: {
            type: DataTypes.STRING
        },
        frequentFlyerNumber: {
            type: DataTypes.STRING
        },
        passportExpireDate: {
            type: DataTypes.DATE
        },
        postCode: {
            type: DataTypes.STRING
        },
        eTicket: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        mobileNumber: {
            type: DataTypes.STRING
        },
        wheelChair: {
            type: DataTypes.STRING
        },
        mealPreference: {
            type: DataTypes.STRING
        },
        paxNumber: {
            type: DataTypes.STRING
        },
        primaryContact: {
            type: DataTypes.ENUM,
            values: ['Yes', 'No']
        },
        extraParams: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'travellers',
        freezeTableName: true,
        timestamps: false,
        underscored: true
    });
};
