const express = require("express");
const router = express.Router();
const { generateForecast } = require("../controllers/forecast.controller");

router.post("/generate", generateForecast);

module.exports = router;
