import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAuthCookie, requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  async function logout() {
    "use server";

    await clearAuthCookie();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-medium text-primary">AI SaaS</p>
            <p className="text-xs text-muted-foreground">
              Signed in as {user.email}
            </p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
