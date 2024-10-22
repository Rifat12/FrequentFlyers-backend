const db = require("./models");
const express = require("express");
const app = express();
require("dotenv").config();
const routes = require("./routes");
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//add cors
const cors = require("cors");
app.use(cors());

app.use("", routes);

async function syncDB() {
  try {
    await db.sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log("db sync failed", error);
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/api/airports", async (req, res) => {
//   const airports = await db.Airport.findAll();
//   res.json(airports);
// });

// app.get("/api/airports/:id", async (req, res) => {
//   const airport = await db.Airport.findByPk(req.params.id);
//   res.json(airport);
// });

// app.post("/api/airports", async (req, res) => {
//   const airport = await db.Airport.create({
//     airport: req.body.airport,
//     city: req.body.city,
//     country: req.body.country,
//     iata: req.body.iata,
//     multiCode: req.body.multiCode,
//     icao: req.body.icao,
//     altitude: req.body.altitude,
//     timeZone: req.body.timeZone,
//     dstTimeZone: req.body.dstTimeZone,
//     timeZoneName: req.body.timeZoneName,
//   });
//   res.json(airport);
// });

// app.put("/api/airports/:id", async (req, res) => {
//   const airport = await db.Airport.findByPk(req.params.id);
//   airport.airport = req.body.airport;
//   airport.city = req.body.city;
//   airport.country = req.body.country;
//   airport.iata = req.body.iata;
//   airport.multiCode = req.body.multiCode;
//   airport.icao = req.body.icao;
//   airport.altitude = req.body.altitude;
//   airport.timeZone = req.body.timeZone;
//   airport.dstTimeZone = req.body.dstTimeZone;
//   airport.timeZoneName = req.body.timeZoneName;
//   await airport.save();
//   res.json(airport);
// });

// app.delete("/api/airports/:id", async (req, res) => {
//   const airport = await db.Airport.findByPk(req.params.id);
//   await airport.destroy();
//   res.json(airport);
// });
