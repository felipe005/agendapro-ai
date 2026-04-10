import express from "express";
import cors from "cors";
import morgan from "morgan";
import generationRoutes from "./routes/generationRoutes.js";
import { env } from "./config/env.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: false
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Catwalk AI Studio API",
    demoMode: env.demoMode,
    provider: "fal.ai"
  });
});

app.use("/api", generationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Unexpected server error"
  });
});
