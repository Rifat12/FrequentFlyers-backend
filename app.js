// Load environment variables first
require("dotenv").config();

const db = require("./models");
const express = require("express");
const session = require('express-session');
const app = express();
const routes = require("./routes");
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS
const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use("", routes);

async function syncDB() {
  try {
    // Only sync without force: true to preserve existing tables
    await db.sequelize.sync({ alter: false });
    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Initialize database connection
syncDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
