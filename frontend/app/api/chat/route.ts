import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getAuthToken, getCurrentUser } from "@/lib/auth";
import {
  createConversation,
  createMessage,
  getConversation,
  StrapiError,
} from "@/lib/strapi";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL_ID = "gemini-2.5-flash";
const TITLE_MAX_LENGTH = 60;

const SYSTEM_PROMPTS = {
  chat:
    "You are a helpful, concise AI assistant. Reply in plain markdown.",
  code: `You are an expert software engineer and pair programmer. Help with code, debugging, architecture, and tooling.
- Prefer correct, modern practices; name things clearly.
- Use fenced code blocks with a language tag (e.g. \`\`\`ts) for all code.
- Keep explanations concise; expand when the user asks for depth.
- Reply in plain markdown.`,
} as const;

type ChatMode = keyof typeof SYSTEM_PROMPTS;

type ChatRequestBody = {
  messages?: UIMessage[];
  conversationId?: string;
  mode?: ChatMode;
};

function getMessageText(message: UIMessage | undefined) {
  if (!message) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => ("text" in part ? part.text : ""))
    .join("")
    .trim();
}

function buildTitle(text: string, mode: ChatMode) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const base =
    trimmed.length <= TITLE_MAX_LENGTH
      ? trimmed || (mode === "code" ? "Code session" : "New conversation")
      : `${trimmed.slice(0, TITLE_MAX_LENGTH - 1).trim()}…`;
  return mode === "code" ? `Code · ${base}` : base;
}

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = jwt ? await getCurrentUser() : null;

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const mode: ChatMode =
    body.mode === "code" || body.mode === "chat" ? body.mode : "chat";
  const systemPrompt = SYSTEM_PROMPTS[mode];

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return Response.json({ error: "messages is required." }, { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return Response.json(
      { error: "The last message must be from the user." },
      { status: 400 }
    );
  }

  const userText = getMessageText(lastMessage);
  if (!userText) {
    return Response.json(
      { error: "The user message is empty." },
      { status: 400 }
    );
  }

  let conversationDocumentId = body.conversationId;

  try {
    if (conversationDocumentId) {
      const existing = await getConversation(jwt, conversationDocumentId);
      if (!existing) {
        return Response.json(
          { error: "Conversation not found." },
          { status: 404 }
        );
      }
    } else {
      const created = await createConversation(jwt, {
        title: buildTitle(userText, mode),
      });
      conversationDocumentId = created.documentId;
    }

    await createMessage(jwt, {
      content: userText,
      role: "user",
      conversationDocumentId,
    });
  } catch (error) {
    const status = error instanceof StrapiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Failed to persist message.";
    return Response.json({ error: message }, { status });
  }

  const result = streamText({
    model: google(MODEL_ID),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  result.consumeStream();

  const finalConversationDocumentId = conversationDocumentId;

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    headers: {
      "x-conversation-id": finalConversationDocumentId,
    },
    messageMetadata: ({ part }) => {
      if (part.type === "start") {
        return { conversationId: finalConversationDocumentId };
      }
    },
    onFinish: async ({ responseMessage }) => {
      const assistantText = getMessageText(responseMessage);
      if (!assistantText) return;

      try {
        await createMessage(jwt, {
          content: assistantText,
          role: "assistant",
          conversationDocumentId: finalConversationDocumentId,
        });
      } catch (error) {
        console.error("[chat] Failed to persist assistant message:", error);
      }
    },
  });
}
