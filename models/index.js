"use strict";

let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let Op = Sequelize.Op;
let sequelize = null;
let db = {};

require("dotenv").config();

sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./dev.sqlite",
  define: {
    timestamps: false,
  },
});

if (!fs.existsSync("./dev.sqlite")) {
  fs.closeSync(fs.openSync("./dev.sqlite", "w"));
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });


Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
