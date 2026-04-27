import { google } from "@ai-sdk/google";
import { generateImage } from "ai";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createImageRecord, StrapiError } from "@/lib/strapi";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Default: Gemini 3.1 image model (override with GOOGLE_IMAGE_MODEL). */
const IMAGE_MODEL =
  process.env.GOOGLE_IMAGE_MODEL ?? "gemini-3.1-flash-image-preview";

type GoogleImageAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const ASPECT_RATIOS: GoogleImageAspectRatio[] = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
];

const MEDIA_TYPE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parseAspectRatio(value: unknown): GoogleImageAspectRatio {
  if (typeof value === "string" && ASPECT_RATIOS.includes(value as GoogleImageAspectRatio)) {
    return value as GoogleImageAspectRatio;
  }
  return "1:1";
}

async function saveGeneratedImage(base64: string, mediaType: string) {
  const extension = MEDIA_TYPE_EXTENSIONS[mediaType] ?? "png";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const publicPath = `/generated-images/${fileName}`;
  const outputDir = join(process.cwd(), "public", "generated-images");

  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, fileName), Buffer.from(base64, "base64"));

  return publicPath;
}

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = jwt ? await getCurrentUser() : null;

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { prompt?: unknown; aspectRatio?: unknown };
  try {
    body = (await request.json()) as { prompt?: unknown; aspectRatio?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "prompt is required." }, { status: 400 });
  }

  const aspectRatio = parseAspectRatio(body.aspectRatio);

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set." },
      { status: 500 }
    );
  }

  try {
    const result = await generateImage({
      model: google.image(IMAGE_MODEL),
      prompt,
      n: 1,
      providerOptions: {
        google: {
          aspectRatio,
        },
      },
    });

    const file = result.image;
    const imageUrl = await saveGeneratedImage(file.base64, file.mediaType);

    const record = await createImageRecord(jwt, {
      prompt,
      imageUrl,
    });

    return Response.json({
      model: IMAGE_MODEL,
      documentId: record.documentId,
      prompt: record.prompt,
      imageUrl: record.imageUrl,
    });
  } catch (error) {
    console.error("[api/images/generate]", error);
    if (error instanceof StrapiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Image generation failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
