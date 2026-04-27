"use client";

import { RiChat3Line } from "@remixicon/react";

import { WorkspaceAiChat } from "@/components/workspace/workspace-ai-chat";

export default function ChatPage() {
  return (
    <WorkspaceAiChat
      mode="chat"
      title="Chat"
      badge="Powered by Gemini 2.5 Flash"
      placeholder="Send a message…"
      emptyState={{
        icon: (
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RiChat3Line className="size-6" />
          </span>
        ),
        title: "Start a conversation",
        description: "Ask anything — answers stream in as the model thinks.",
      }}
    />
  );
}
