import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { registerWithStrapi, StrapiError } from "@/lib/strapi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    const auth = await registerWithStrapi(username, email, password);
    await setAuthCookie(auth.jwt);

    return NextResponse.json({ user: auth.user });
  } catch (error) {
    const message =
      error instanceof StrapiError
        ? error.message
        : "Unable to create your account right now.";
    const status = error instanceof StrapiError ? error.status : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
