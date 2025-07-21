const express = require("express");
const router = express.Router();

const { uploadSalesFile } = require("../controllers/sales.controller");

const upload = require("../middlewares/upload.middleware");

router.post("/upload", upload.single("file"), uploadSalesFile);

module.exports = router;
