import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, fetchCurrentUser } from "@/lib/strapi";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function authCookieOptions() {
  return {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setAuthCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, jwt, authCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    ...authCookieOptions(),
    maxAge: 0,
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    return await fetchCurrentUser(token);
  } catch {
    return null;
  }
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireUnAuth(redirectTo = "/dashboard") {
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }

  return null;
}
