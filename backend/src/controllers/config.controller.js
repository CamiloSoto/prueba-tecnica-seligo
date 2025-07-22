const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getConfig = async (req, res) => {
  const userId = req.user.id;
  try {
    const config = await prisma.configuration.findUnique({ where: { userId } });
    res.json(config);
  } catch {
    res.status(404).json({ error: "No configuration found" });
  }
};

exports.updateConfig = async (req, res) => {
  const userId = req.user.id;
  const {
    confidenceLevel,
    forecastHorizon,
    alertThresholds,
    notificationSettings,
  } = req.body;
  try {
    const config = await prisma.configuration.upsert({
      where: { userId },
      update: {
        confidenceLevel,
        forecastHorizon,
        alertThresholds,
        notificationSettings,
      },
      create: {
        userId,
        confidenceLevel,
        forecastHorizon,
        alertThresholds,
        notificationSettings,
      },
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Error saving configuration" });
  }
};
