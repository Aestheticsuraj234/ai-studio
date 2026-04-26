"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = isRegister
      ? {
          username: String(formData.get("username") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }
      : {
          identifier: String(formData.get("identifier") ?? ""),
          password: String(formData.get("password") ?? ""),
        };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Something went wrong. Please try again.");
      setIsPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        {isRegister ? (
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
            />
          </Field>
        ) : null}

        <Field>
          <FieldLabel htmlFor={isRegister ? "email" : "identifier"}>
            {isRegister ? "Email" : "Email or username"}
          </FieldLabel>
          <Input
            id={isRegister ? "email" : "identifier"}
            name={isRegister ? "email" : "identifier"}
            type={isRegister ? "email" : "text"}
            autoComplete={isRegister ? "email" : "username"}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
          />
        </Field>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending
            ? isRegister
              ? "Creating account..."
              : "Signing in..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {isRegister ? "Already have an account?" : "No account yet?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {isRegister ? "Sign in" : "Create one"}
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
