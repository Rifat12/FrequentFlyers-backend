// "use strict";

// module.exports = function (sequelize, DataTypes) {
//   return sequelize.define(
//     "flightOffer",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         validate: {
//           notEmpty: true,
//         },
//       },
//       tripId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'trips',
//           key: 'id'
//         }
//       },
//       offerId: {
//         type: DataTypes.STRING,
//       },
//       offer: {
//         type: DataTypes.STRING,
//       },
//       extraParams: {
//         type: DataTypes.STRING,
//       },
//     },
//     {
//       tableName: "flight_offer",
//       freezeTableName: true,
//       timestamps: false,
//       underscored: true,
//     }
//   );
// };