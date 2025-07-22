const express = require("express");
const router = express.Router();

const { uploadSalesFile, getSalesData } = require("../controllers/sales.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

router.post("/upload", authMiddleware, upload.single("file"), uploadSalesFile);
router.get("/", authMiddleware, getSalesData);

module.exports = router;
