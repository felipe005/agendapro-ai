import express from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { createLocalJob, getLocalJob, listLocalJobs, updateLocalJob } from "../services/generationStore.js";
import { fetchGenerationStatus, getModelCatalog, submitGeneration } from "../services/videoProvider.js";
import { env } from "../config/env.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024
  }
});

function fileBufferToDataUri(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

router.get("/meta", (_req, res) => {
  res.json({
    demoMode: env.demoMode,
    provider: "fal.ai",
    models: getModelCatalog()
  });
});

router.get("/generations", (_req, res) => {
  res.json({
    items: listLocalJobs()
  });
});

router.post("/generations", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Upload an image of the garment before generating");
    }

    const payload = {
      brandName: req.body.brandName || "",
      garmentType: req.body.garmentType || "pants",
      garmentDescription: req.body.garmentDescription || "",
      styleNotes: req.body.styleNotes || "",
      targetAudience: req.body.targetAudience || "",
      motionStyle: req.body.motionStyle || "elegant",
      cameraStyle: req.body.cameraStyle || "editorial",
      backgroundStyle: req.body.backgroundStyle || "studio",
      aspectRatio: req.body.aspectRatio || "9:16",
      duration: req.body.duration || "8s",
      resolution: req.body.resolution || "720p",
      movementAmplitude: req.body.movementAmplitude || "auto",
      modelKey: req.body.modelKey || "premium",
      imageDataUri: fileBufferToDataUri(req.file)
    };

    const submission = await submitGeneration(payload);
    const job = createLocalJob({
      name: req.file.originalname,
      previewImage: payload.imageDataUri,
      ...payload,
      ...submission
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

router.get("/generations/:id", async (req, res, next) => {
  try {
    const job = getLocalJob(req.params.id);

    if (!job) {
      throw new ApiError(404, "Generation not found");
    }

    if (job.status === "COMPLETED" && job.videoUrl) {
      return res.json(job);
    }

    const providerState = await fetchGenerationStatus(job);
    const updatedJob = updateLocalJob(job.id, {
      status: providerState.status,
      videoUrl: providerState.videoUrl || job.videoUrl || null,
      providerStatus: providerState.providerStatus,
      logs: providerState.logs || job.logs || []
    });

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
});

export default router;
