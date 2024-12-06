const express = require("express");
const router = express.Router();
const engine = require("../engine");
const { parseNaturalLanguageQuery } = require("../utils/searchUtils");
router.get("/", (req, res) => res.send("letsfly air-api is working!"));
const { authCheck } = require('./authRoutes');

// Regular search endpoint remains unchanged
router.post("/search", authCheck, async (req, res) => {
  try {
    return res.json(await engine.search(req.body));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/intelligent-search", authCheck, async (req, res) => {
  try {
    const { naturalQuery, tripId } = req.body;
    if (!naturalQuery) {
      return res.status(400).json({ 
        success: false, 
        error: "Natural language query is required" 
      });
    }
    if (!tripId) {
      return res.status(400).json({ 
        success: false, 
        error: "tripId is required" 
      });
    }
    
    const parsedQuery = await parseNaturalLanguageQuery(naturalQuery, tripId);
    return res.json(parsedQuery);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/book", authCheck, async (req, res) => {
  try {
    return res.json(await engine.book(req.body));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
