"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { RiImageLine, RiLoader4Line, RiSparklingLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type GalleryItem = {
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
  createdAt: string;
};

type GenerateResponse = {
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
  model: string;
};

const ASPECT_OPTIONS: { value: string; label: string }[] = [
  { value: "1:1", label: "1:1 — Square" },
  { value: "16:9", label: "16:9 — Wide" },
  { value: "9:16", label: "9:16 — Tall" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/images", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) return;
        throw new Error("Failed to load gallery");
      }
      const data = (await res.json()) as { images: GalleryItem[] };
      setGallery(data.images ?? []);
    } catch {
      toast.error("Couldn't load your image history.");
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
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, aspectRatio }),
      });
      const data = (await res.json()) as GenerateResponse & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setPreview(data.imageUrl);
      toast.success("Image ready");
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
            Image
          </h1>
          <p className="text-xs text-muted-foreground">
            Gemini 3 (default: 3.1 flash image preview)
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Describe a scene; images are generated with the AI SDK{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">generateImage</code>{" "}
          and saved to your Strapi collection.
        </p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/30 p-4"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="image-prompt">Prompt</Label>
            <textarea
              id="image-prompt"
              className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="E.g. A red panda reading a book in a cozy library, soft lighting…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="grid gap-2 sm:w-52">
            <Label htmlFor="aspect">Aspect ratio</Label>
            <select
              id="aspect"
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
            aspectRatio === "1:1" && "aspect-square max-w-md",
            aspectRatio === "16:9" && "aspect-video max-w-3xl",
            aspectRatio === "9:16" && "aspect-9/16 max-w-xs",
            aspectRatio === "4:3" && "aspect-4/3 max-w-2xl",
            aspectRatio === "3:4" && "aspect-3/4 max-w-lg"
          )}
        >
          {isGenerating && (
            <>
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="bg-background/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <RiLoader4Line className="text-primary size-10 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Generating your image…
                </p>
              </div>
            </>
          )}
          {!isGenerating && !preview && (
            <div className="text-muted-foreground flex min-h-72 w-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
              <RiImageLine className="size-10 opacity-50" />
              <span>Your new image will show here.</span>
            </div>
          )}
          {preview && !isGenerating && (
            // eslint-disable-next-line @next/next/no-img-element -- generated images are stored in public/generated-images
            <img
              className="max-h-[min(70vh,720px)] w-full object-contain p-2"
              src={preview}
              alt={prompt || "Generated image"}
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-tight">Your generations</h2>
        {isLoadingGallery ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No images yet. Generate one above — it will be listed here and
            stored in Strapi.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item) => (
              <li
                key={item.documentId}
                className="group border-border/60 relative overflow-hidden rounded-lg border"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- generated images are stored in public/generated-images
                  <img
                    src={item.imageUrl}
                    alt={item.prompt ?? ""}
                    className="aspect-square w-full object-cover transition group-hover:opacity-90"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-muted flex aspect-square items-center justify-center text-xs text-muted-foreground">
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
