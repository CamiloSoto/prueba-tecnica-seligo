const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerDocs = require("./swagger");

const authRoutes = require("./routes/auth.routes");
const salesRoutes = require("./routes/sales.routes");
const forecastRoutes = require("./routes/forecast.routes");
const configRoutes = require("./routes/config.routes");
const healthRouter = require("./routes/health.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://prueba-tecnica-seligo.vercel.app",
      "https://prueba-tecnica-seligo.onrender.com",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/config", configRoutes);
app.use("/api/health", healthRouter);

swaggerDocs(app);

module.exports = app;
