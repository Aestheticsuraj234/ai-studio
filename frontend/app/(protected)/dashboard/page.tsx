import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <section className="grid gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <p className="text-sm font-medium text-primary">Protected route</p>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Dashboard
          </CardTitle>
          <CardDescription className="max-w-2xl">
            This page renders only after `requireAuth` confirms a valid Strapi
            session cookie. Add your authenticated SaaS experience here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Auth source</p>
              <p className="mt-1 font-medium">Strapi Users & Permissions</p>
            </div>
            <div className="border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Session storage</p>
              <p className="mt-1 font-medium">httpOnly cookie</p>
            </div>
            <div className="border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Guard</p>
              <p className="mt-1 font-medium">requireAuth()</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
