import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import generationRoutes from "./routes/generationRoutes.js";
import { env } from "./config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const frontendDist = path.join(projectRoot, "frontend", "dist");
const indexFile = path.join(frontendDist, "index.html");

export const app = express();

app.use(
  cors({
    origin: env.clientUrl || true,
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
app.use(express.static(frontendDist, { index: "index.html" }));

app.get("/", (_req, res) => {
  res.sendFile(indexFile);
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(indexFile);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Unexpected server error"
  });
});
