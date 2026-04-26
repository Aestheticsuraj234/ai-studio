import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUnAuth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUnAuth();

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="text-center">
          <p className="text-sm font-medium text-primary">AI SaaS</p>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Authenticate with your Strapi account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
