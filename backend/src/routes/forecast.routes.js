const express = require("express");
const router = express.Router();

const {
  generateForecast,
  getForecasts,
} = require("../controllers/forecast.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Forecast
 *   description: Generación y consulta de pronósticos
 */

/**
 * @swagger
 * /forecast/generate:
 *   post:
 *     summary: Genera pronóstico para un SKU
 *     tags: [Forecast]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sku, horizon, confidenceLevel]
 *             properties:
 *               sku:
 *                 type: string
 *                 example: PROD001
 *               horizon:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 6
 *                 example: 3
 *               confidenceLevel:
 *                 type: number
 *                 enum: [0.8, 0.9, 0.95]
 *                 example: 0.95
 *     responses:
 *       200:
 *         description: Pronóstico generado
 *       400:
 *         description: Parámetros inválidos
 *       404:
 *         description: SKU no encontrado
 *       500:
 *         description: Error interno
 */
router.post("/generate", authMiddleware, generateForecast);

/**
 * @swagger
 * /forecast:
 *   get:
 *     summary: Obtiene todos los pronósticos del usuario
 *     tags: [Forecast]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pronósticos
 *       500:
 *         description: Error interno
 */
router.get("/", authMiddleware, getForecasts);

module.exports = router;
