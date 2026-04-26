export const AUTH_COOKIE_NAME = "strapi_jwt";

const DEFAULT_STRAPI_URL = "http://localhost:1337";

export type StrapiUser = {
  id: number;
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
