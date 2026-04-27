export const AUTH_COOKIE_NAME = "strapi_jwt";

const DEFAULT_STRAPI_URL = "http://localhost:1337";

export type StrapiUser = {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StrapiAuthResponse = {
  jwt: string;
  user: StrapiUser;
};

export class StrapiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
  }
}

function getStrapiUrl() {
  return (
    process.env.STRAPI_URL ??
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    DEFAULT_STRAPI_URL
  ).replace(/\/$/, "");
}

async function strapiFetch<T>(
  path: string,
  init: RequestInit = {},
  jwt?: string
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  const response = await fetch(`${getStrapiUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ??
      data?.message ??
      "Strapi request failed. Please try again.";

    throw new StrapiError(message, response.status);
  }

  return data as T;
}

export function loginWithStrapi(identifier: string, password: string) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function registerWithStrapi(
  username: string,
  email: string,
  password: string
) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function fetchCurrentUser(jwt: string) {
  return strapiFetch<StrapiUser>("/api/users/me", {}, jwt);
}

// ---------------------------------------------------------------------------
// Chat: conversations & messages
// ---------------------------------------------------------------------------

export type ChatRole = "user" | "assistant";

export type StrapiMessage = {
  id: number;
  documentId: string;
  content: string;
  role: ChatRole;
  createdAt: string;
  updatedAt: string;
};

export type StrapiConversation = {
  id: number;
  documentId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: StrapiMessage[];
};

type StrapiSingle<T> = { data: T };
type StrapiList<T> = {
  data: T[];
  meta?: { pagination?: { page: number; pageSize: number; total: number } };
};

export async function createConversation(
  jwt: string,
  params: { title: string }
): Promise<StrapiConversation> {
  const res = await strapiFetch<StrapiSingle<StrapiConversation>>(
    "/api/conversations",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          title: params.title,
        },
      }),
    },
    jwt
  );
  return res.data;
}

/**
 * The Strapi conversation controller restricts this lookup to the JWT owner.
 * Returns `null` if the conversation does not exist or belongs to another user.
 */
export async function getConversation(
  jwt: string,
  documentId: string
): Promise<StrapiConversation | null> {
  try {
    const res = await strapiFetch<StrapiSingle<StrapiConversation>>(
      `/api/conversations/${encodeURIComponent(documentId)}`,
      {},
      jwt
    );

    return res.data;
  } catch (error) {
    if (error instanceof StrapiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function listConversations(jwt: string): Promise<StrapiConversation[]> {
  const params = new URLSearchParams({
    sort: "updatedAt:desc",
    "pagination[pageSize]": "50",
  });
  const res = await strapiFetch<StrapiList<StrapiConversation>>(
    `/api/conversations?${params.toString()}`,
    {},
    jwt
  );
  return res.data;
}

export async function createMessage(
  jwt: string,
  params: { content: string; role: ChatRole; conversationDocumentId: string }
): Promise<StrapiMessage> {
  const res = await strapiFetch<StrapiSingle<StrapiMessage>>(
    "/api/messages",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          content: params.content,
          role: params.role,
          conversation: params.conversationDocumentId,
        },
      }),
    },
    jwt
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Image generation records
// ---------------------------------------------------------------------------

export type StrapiImageRecord = {
  id: number;
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createImageRecord(
  jwt: string,
  params: { prompt: string; imageUrl: string }
): Promise<StrapiImageRecord> {
  const res = await strapiFetch<StrapiSingle<StrapiImageRecord>>(
    "/api/images",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          prompt: params.prompt,
          imageUrl: params.imageUrl,
        },
      }),
    },
    jwt
  );
  return res.data;
}

export async function listImageRecords(jwt: string): Promise<StrapiImageRecord[]> {
  const params = new URLSearchParams({
    sort: "createdAt:desc",
    "pagination[pageSize]": "24",
  });
  const res = await strapiFetch<StrapiList<StrapiImageRecord>>(
    `/api/images?${params.toString()}`,
    {},
    jwt
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Video generation records
// ---------------------------------------------------------------------------

export type StrapiVideoRecord = {
  id: number;
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createVideoRecord(
  jwt: string,
  params: { prompt: string; videoUrl: string }
): Promise<StrapiVideoRecord> {
  const res = await strapiFetch<StrapiSingle<StrapiVideoRecord>>(
    "/api/videos",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          prompt: params.prompt,
          videoUrl: params.videoUrl,
        },
      }),
    },
    jwt
  );
  return res.data;
}

export async function listVideoRecords(jwt: string): Promise<StrapiVideoRecord[]> {
  const params = new URLSearchParams({
    sort: "createdAt:desc",
    "pagination[pageSize]": "24",
  });
  const res = await strapiFetch<StrapiList<StrapiVideoRecord>>(
    `/api/videos?${params.toString()}`,
    {},
    jwt
  );
  return res.data;
}
