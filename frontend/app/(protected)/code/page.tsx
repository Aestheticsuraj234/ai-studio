"use client";

import { RiCodeSSlashLine } from "@remixicon/react";

import { WorkspaceAiChat } from "@/components/workspace/workspace-ai-chat";

export default function CodePage() {
  return (
    <WorkspaceAiChat
      mode="code"
      title="Code"
      badge="Code assistant · Gemini 2.5 Flash"
      placeholder="Describe a bug, paste a stack trace, or ask for a snippet…"
      emptyState={{
        icon: (
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RiCodeSSlashLine className="size-6" />
          </span>
        ),
        title: "Pair on code with AI",
        description:
          "Get refactors, reviews, and debugging help — same streaming UI as Chat, tuned for software work.",
      }}
    />
  );
}
