const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".csv" || ext === ".xlsx") cb(null, true);
  else cb(new Error("Only CSV and XLSX files are allowed"), false);
};

module.exports = multer({ storage, fileFilter });
