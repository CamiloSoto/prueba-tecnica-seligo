const express = require("express");
const router = express.Router();

const {
  uploadSalesFile,
  getSalesData,
} = require("../controllers/sales.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Carga y consulta de datos de ventas
 */

/**
 * @swagger
 * /sales/upload:
 *   post:
 *     summary: Sube archivo de ventas
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Archivo subido correctamente
 *       400:
 *         description: Archivo inválido
 *       500:
 *         description: Error en el servidor
 */
router.post("/upload", authMiddleware, upload.single("file"), uploadSalesFile);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Obtiene datos de ventas del usuario
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ventas
 *       500:
 *         description: Error interno
 */
router.get("/", authMiddleware, getSalesData);

module.exports = router;
