"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { RiFilmLine, RiLoader4Line, RiSparklingLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type GalleryItem = {
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  createdAt: string;
};

type GenerateResponse = {
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  model: string;
};

const ASPECT_OPTIONS: { value: string; label: string }[] = [
  { value: "16:9", label: "16:9 — Wide" },
  { value: "9:16", label: "9:16 — Vertical" },
];

const DURATION_OPTIONS: { value: string; label: string }[] = [
  { value: "4", label: "4 seconds" },
  { value: "6", label: "6 seconds" },
  { value: "8", label: "8 seconds" },
];

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [durationSeconds, setDurationSeconds] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/videos", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) return;
        throw new Error("Failed to load gallery");
      }
      const data = (await res.json()) as { videos: GalleryItem[] };
      setGallery(data.videos ?? []);
    } catch {
      toast.error("Couldn't load your video history.");
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadGallery();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadGallery]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || isGenerating) return;

    setIsGenerating(true);
    setPreview(null);
    try {
      const res = await fetch("/api/videos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, aspectRatio, durationSeconds }),
      });
      const data = (await res.json()) as GenerateResponse & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setPreview(data.videoUrl);
      toast.success("Video ready");
      void loadGallery();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-8">
      <header>
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Video
          </h1>
          <p className="text-xs text-muted-foreground">
            Veo 3.1 (default: generate preview)
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Describe a scene; videos are generated with Google Veo and saved to
          your Strapi collection.
        </p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/30 p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr,auto,auto] lg:items-end">
          <div className="grid gap-2">
            <Label htmlFor="video-prompt">Prompt</Label>
            <textarea
              id="video-prompt"
              className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="E.g. A cinematic drone shot over a neon city at night, slow forward motion…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="grid gap-2 sm:w-52">
            <Label htmlFor="video-aspect">Aspect ratio</Label>
            <select
              id="video-aspect"
              className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isGenerating}
            >
              {ASPECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 sm:w-44">
            <Label htmlFor="video-duration">Duration</Label>
            <select
              id="video-duration"
              className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              disabled={isGenerating}
            >
              {DURATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="gap-2"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <RiLoader4Line className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <RiSparklingLine className="size-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>

      <section className="space-y-2">
        <h2 className="text-sm font-medium tracking-tight">Latest result</h2>
        <div
          className={cn(
            "relative flex min-h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/20",
            aspectRatio === "16:9" && "aspect-video max-w-3xl",
            aspectRatio === "9:16" && "aspect-9/16 max-w-xs"
          )}
        >
          {isGenerating && (
            <>
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="bg-background/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center backdrop-blur-sm">
                <RiLoader4Line className="text-primary size-10 animate-spin" />
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Generating your video…
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Veo jobs can take a few minutes.
                  </p>
                </div>
              </div>
            </>
          )}
          {!isGenerating && !preview && (
            <div className="text-muted-foreground flex min-h-72 w-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
              <RiFilmLine className="size-10 opacity-50" />
              <span>Your new video will show here.</span>
            </div>
          )}
          {preview && !isGenerating && (
            <video
              className="max-h-[min(70vh,720px)] w-full object-contain p-2"
              src={preview}
              controls
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-tight">Your generations</h2>
        {isLoadingGallery ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No videos yet. Generate one above — it will be listed here and
            stored in Strapi.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <li
                key={item.documentId}
                className="group border-border/60 relative overflow-hidden rounded-lg border"
              >
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    className="aspect-video w-full bg-black object-cover transition group-hover:opacity-90"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="bg-muted flex aspect-video items-center justify-center text-xs text-muted-foreground">
                    No preview
                  </div>
                )}
                {item.prompt && (
                  <p className="line-clamp-2 border-t border-border/60 bg-card/90 p-2 text-xs text-muted-foreground">
                    {item.prompt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
