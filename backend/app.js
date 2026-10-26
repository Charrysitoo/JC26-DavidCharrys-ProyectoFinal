require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDb } = require("./src/db");
const ordersRouter = require("./src/routes/orders");
const messagesRouter = require("./src/routes/messages");
const chatRouter = require("./src/routes/chat");

const app = express();
const PORT = process.env.PORT || 4000;
const configuredCorsOrigin = process.env.CORS_ORIGIN;

if (process.env.NODE_ENV === "production" && !configuredCorsOrigin?.trim()) {
  throw new Error("CORS_ORIGIN es obligatoria en producción.");
}

const corsOrigins = (configuredCorsOrigin || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && corsOrigins.length === 0) {
  throw new Error("CORS_ORIGIN es obligatoria en producción.");
}

app.use(cors({ origin: corsOrigins }));
app.use(express.json({ limit: "100kb" }));

// Healthcheck sencillo para verificar la API.
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "makarios-api", time: new Date().toISOString() });
});

app.use("/api/orders", ordersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/chat", chatRouter);

// 404 para rutas desconocidas de la API.
app.use((req, res) => {
  res.status(404).json({ ok: false, errors: ["Ruta no encontrada."] });
});

// Manejador central de errores.
app.use((err, req, res, next) => {
  console.error("[error]", err);
  res.status(500).json({ ok: false, errors: ["Error interno del servidor."] });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Makarios API escuchando en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB:", err.message);
    process.exit(1);
  });
