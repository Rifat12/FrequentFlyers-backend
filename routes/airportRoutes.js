const express = require("express");
const router = express.Router();
const engine = require("../engine");
const { authCheck } = require('./authRoutes');

router.get("/search", authCheck, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        responseType: "airport-search",
        data: [],
        message: "Please provide at least 2 characters"
      });
    }
    return res.json(await engine.searchAirport(query));
  } catch (error) {
    console.error('Error searching airports:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get("/:iata", authCheck, async (req, res) => {
  try {
    const { iata } = req.params;
    const response = await engine.getAirport(iata);
    if (!response.data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Airport not found' 
      });
    }
    return res.json(response);
  } catch (error) {
    console.error('Error fetching airport details:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
