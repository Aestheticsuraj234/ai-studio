"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiChat3Line,
  RiCodeSSlashLine,
  RiImageLine,
  RiFilmLine,
  RiSparklingLine,
  RiUser3Line,
  RiLogoutBoxRLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

const nav = [
  { href: "/chat", label: "Chat", icon: RiChat3Line },
  { href: "/code", label: "Code", icon: RiCodeSSlashLine },
  { href: "/image", label: "Image", icon: RiImageLine },
  { href: "/video", label: "Video", icon: RiFilmLine },
] as const;

type DashboardShellProps = {
  userEmail: string;
  children: ReactNode;
};

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-card/40 md:w-56 md:border-r md:border-b-0 md:min-h-screen">
        <div className="flex flex-col gap-3 p-3 md:p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-muted/80 md:px-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
              <RiSparklingLine className="h-4 w-4" />
            </span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              AIverse
            </span>
          </Link>

          <nav
            className="flex gap-0.5 overflow-x-auto pb-0.5 md:flex-col md:overflow-visible md:pb-0"
            aria-label="Workspace"
          >
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-border p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Theme
            </span>
            <ModeToggle />
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-md border border-border/60 bg-background/80 px-2.5 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-muted text-foreground">
              <RiUser3Line className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Signed in
              </p>
              <p className="truncate text-xs text-foreground" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>

          <form action={logoutAction} className="w-full">
            <Button
              type="submit"
              variant="outline"
              className="h-9 w-full gap-2"
            >
              <RiLogoutBoxRLine className="h-4 w-4" />
              Log out
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-h-0 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
