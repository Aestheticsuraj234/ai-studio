import { GoogleGenAI } from "@google/genai";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createVideoRecord, StrapiError } from "@/lib/strapi";

export const runtime = "nodejs";
export const maxDuration = 600;

/** Default: Veo 3.1 video model (override with GOOGLE_VIDEO_MODEL). */
const VIDEO_MODEL =
  process.env.GOOGLE_VIDEO_MODEL ?? "veo-3.1-generate-preview";

type GoogleVideoAspectRatio = "16:9" | "9:16";
type GoogleVideoDuration = 4 | 6 | 8;

const ASPECT_RATIOS: GoogleVideoAspectRatio[] = ["16:9", "9:16"];
const DURATIONS: GoogleVideoDuration[] = [4, 6, 8];
const POLL_INTERVAL_MS = 10_000;
const MAX_POLLS = 60;

function parseAspectRatio(value: unknown): GoogleVideoAspectRatio {
  if (typeof value === "string" && ASPECT_RATIOS.includes(value as GoogleVideoAspectRatio)) {
    return value as GoogleVideoAspectRatio;
  }
  return "16:9";
}

function parseDuration(value: unknown): GoogleVideoDuration {
  if (typeof value === "number" && DURATIONS.includes(value as GoogleVideoDuration)) {
    return value as GoogleVideoDuration;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (DURATIONS.includes(parsed as GoogleVideoDuration)) {
      return parsed as GoogleVideoDuration;
    }
  }
  return 4;
}

function getOperationErrorMessage(error: Record<string, unknown> | undefined) {
  if (!error) return null;
  return typeof error.message === "string"
    ? error.message
    : "Video generation failed.";
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveGeneratedVideo(
  ai: GoogleGenAI,
  file: Parameters<GoogleGenAI["files"]["download"]>[0]["file"]
) {
  const fileName = `${crypto.randomUUID()}.mp4`;
  const publicPath = `/generated-videos/${fileName}`;
  const outputDir = join(process.cwd(), "public", "generated-videos");
  const outputPath = join(outputDir, fileName);

  await mkdir(outputDir, { recursive: true });
  await ai.files.download({ file, downloadPath: outputPath });

  return publicPath;
}

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = jwt ? await getCurrentUser() : null;

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { prompt?: unknown; aspectRatio?: unknown; durationSeconds?: unknown };
  try {
    body = (await request.json()) as {
      prompt?: unknown;
      aspectRatio?: unknown;
      durationSeconds?: unknown;
    };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "prompt is required." }, { status: 400 });
  }

  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const aspectRatio = parseAspectRatio(body.aspectRatio);
  const durationSeconds = parseDuration(body.durationSeconds);

  try {
    const ai = new GoogleGenAI({ apiKey });
    let operation = await ai.models.generateVideos({
      model: VIDEO_MODEL,
      prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio,
        durationSeconds,
      },
    });

    for (let poll = 0; !operation.done && poll < MAX_POLLS; poll += 1) {
      await delay(POLL_INTERVAL_MS);
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation.done) {
      return Response.json(
        { error: "Video generation is still processing. Please try again later." },
        { status: 504 }
      );
    }

    const operationError = getOperationErrorMessage(operation.error);
    if (operationError) {
      return Response.json({ error: operationError }, { status: 500 });
    }

    const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
    if (!generatedVideo) {
      const reason = operation.response?.raiMediaFilteredReasons?.join(" ");
      return Response.json(
        { error: reason || "No video was generated." },
        { status: 500 }
      );
    }

    const videoUrl = await saveGeneratedVideo(ai, generatedVideo);
    const record = await createVideoRecord(jwt, {
      prompt,
      videoUrl,
    });

    return Response.json({
      model: VIDEO_MODEL,
      documentId: record.documentId,
      prompt: record.prompt,
      videoUrl: record.videoUrl,
    });
  } catch (error) {
    console.error("[api/videos/generate]", error);
    if (error instanceof StrapiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Video generation failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
