import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { loginWithStrapi, StrapiError } from "@/lib/strapi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth = await loginWithStrapi(
      String(body.identifier ?? ""),
      String(body.password ?? "")
    );
    await setAuthCookie(auth.jwt);
    return NextResponse.json({ user: auth.user });
  } catch (error) {
    const message =
      error instanceof StrapiError
        ? error.message
        : "Unable to sign in right now.";
    const status = error instanceof StrapiError ? error.status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
