const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const { getConfig, updateConfig } = require("../controllers/config.controller");

/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Configuración del usuario
 */

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Obtiene configuración actual del usuario
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración obtenida
 *       404:
 *         description: No existe configuración
 */
router.get("/", authMiddleware, getConfig);

/**
 * @swagger
 * /config:
 *   put:
 *     summary: Actualiza la configuración
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confidenceLevel:
 *                 type: number
 *                 example: 0.95
 *               forecastHorizon:
 *                 type: integer
 *                 example: 6
 *               alertThresholds:
 *                 type: string
 *                 example: "15%"
 *               notificationSettings:
 *                 type: string
 *                 example: "email"
 *     responses:
 *       200:
 *         description: Configuración actualizada
 *       500:
 *         description: Error al guardar configuración
 */
router.put("/", authMiddleware, updateConfig);

module.exports = router;
