const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const { getConfig, updateConfig } = require("../controllers/config.controller");

router.get("/", authMiddleware, getConfig);
router.put("/", authMiddleware, updateConfig);

module.exports = router;
