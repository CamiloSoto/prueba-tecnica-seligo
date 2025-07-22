const express = require("express");
const router = express.Router();

const {
  generateForecast,
  getForecasts,
} = require("../controllers/forecast.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/generate", authMiddleware, generateForecast);
router.get("/", authMiddleware, getForecasts);

module.exports = router;
