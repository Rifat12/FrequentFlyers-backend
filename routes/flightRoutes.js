const express = require("express");
const router = express.Router();
const engine = require("../engine");
router.get("/", (req, res) => res.send("letsfly air-api is working!"));
const { authCheck } = require('./authRoutes');


router.post("/search", authCheck, async (req, res) => {
  try {
    return res.json(await engine.search(req.body));
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
