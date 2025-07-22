const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const modelVersion = "v1.0";

exports.generateForecast = async (req, res) => {
  const { sku, horizon, confidenceLevel } = req.body;

  if (!sku || !horizon || !confidenceLevel)
    return res.status(400).json({ error: "Missing required fields" });

  if (horizon < 1 || horizon > 6)
    return res
      .status(400)
      .json({ error: "Forecast horizon must be between 1 and 6 months" });

  try {
    const sales = await prisma.salesData.findMany({
      where: { sku },
      orderBy: { date: "asc" },
    });

    if (sales.length === 0)
      return res
        .status(404)
        .json({ error: "No sales data found for this SKU" });

    // Promedio base de cantidad vendida
    const baseAverage = Math.round(
      sales.reduce((sum, s) => sum + s.quantity, 0) / sales.length
    );

    const today = new Date();
    const forecasts = [];

    for (let i = 1; i <= horizon; i++) {
      const forecastDate = new Date(
        today.getFullYear(),
        today.getMonth() + i,
        1
      );

      const seasonalFactor = 1 + (Math.random() * 0.2 - 0.1); // ±10%
      const trend = 0.03 * i; // 3% mensual
      const base = Math.round(baseAverage * (1 + trend) * seasonalFactor);

      // ± margen por confianza
      const margin =
        confidenceLevel === 0.95 ? 0.2 : confidenceLevel === 0.9 ? 0.15 : 0.1;
      const upper = Math.ceil(base * (1 + margin));
      const lower = Math.floor(base * (1 - margin));
      forecasts.push({
        userId: req.user.id,
        sku,
        forecastDate,
        baseValue: base,
        upperBound: upper,
        lowerBound: lower,
        confidenceLevel,
        generatedAt: new Date(),
        modelVersion,
      });
    }

    await prisma.forecast.createMany({ data: forecasts });

    res.json({ forecasts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Forecast generation failed" });
  }
};

exports.getForecasts = async (req, res) => {
  const userId = req.user.id;
  try {
    const forecasts = await prisma.forecast.findMany({ where: { userId } });
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching forecasts" });
  }
};
