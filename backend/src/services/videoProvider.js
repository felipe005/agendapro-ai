import { fal } from "@fal-ai/client";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { buildFashionPrompt, buildNegativePrompt } from "../utils/promptBuilder.js";

if (env.falKey) {
  fal.config({ credentials: env.falKey });
}

const MODEL_MAP = {
  premium: {
    endpoint: "fal-ai/veo3.1/fast/image-to-video",
    label: "Veo 3.1 Fast",
    buildInput: (payload) => ({
      prompt: buildFashionPrompt(payload),
      negative_prompt: buildNegativePrompt(),
      image_url: payload.imageDataUri,
      aspect_ratio: payload.aspectRatio,
      duration: payload.duration,
      resolution: payload.resolution,
      generate_audio: false,
      safety_tolerance: "4"
    })
  },
  fast: {
    endpoint: "fal-ai/vidu/q1/image-to-video",
    label: "Vidu Q1",
    buildInput: (payload) => ({
      prompt: buildFashionPrompt(payload),
      image_url: payload.imageDataUri,
      movement_amplitude: payload.movementAmplitude
    })
  }
};

export function getModelCatalog() {
  return Object.entries(MODEL_MAP).map(([value, model]) => ({
    value,
    label: model.label
  }));
}

export async function submitGeneration(payload) {
  const selectedModel = MODEL_MAP[payload.modelKey] || MODEL_MAP.premium;

  if (env.demoMode) {
    return {
      requestId: `demo-${Date.now()}`,
      provider: "fal.ai-demo",
      endpoint: selectedModel.endpoint,
      prompt: buildFashionPrompt(payload)
    };
  }

  try {
    const submission = await fal.queue.submit(selectedModel.endpoint, {
      input: selectedModel.buildInput(payload)
    });

    return {
      requestId: submission.request_id,
      provider: "fal.ai",
      endpoint: selectedModel.endpoint,
      prompt: buildFashionPrompt(payload)
    };
  } catch (error) {
    throw new ApiError(502, error.message || "Failed to submit generation to fal.ai");
  }
}

export async function fetchGenerationStatus(job) {
  if (env.demoMode) {
    return {
      status: "COMPLETED",
      videoUrl: "https://storage.googleapis.com/falserverless/model_tests/gallery/veo3-1-i2v.mp4",
      providerStatus: "Demo mode using official fal sample output"
    };
  }

  try {
    const status = await fal.queue.status(job.endpoint, {
      requestId: job.requestId,
      logs: true
    });

    if (status.status !== "COMPLETED") {
      return {
        status: status.status,
        providerStatus: status.status,
        logs: status.logs || []
      };
    }

    const result = await fal.queue.result(job.endpoint, {
      requestId: job.requestId
    });

    return {
      status: "COMPLETED",
      videoUrl: result.data?.video?.url || null,
      providerStatus: status.status,
      logs: status.logs || []
    };
  } catch (error) {
    throw new ApiError(502, error.message || "Failed to fetch generation status");
  }
}
