import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { loginWithStrapi, StrapiError } from "@/lib/strapi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier =
      typeof body.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    const auth = await loginWithStrapi(identifier, password);
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
