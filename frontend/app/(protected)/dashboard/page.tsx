import Link from "next/link";
import {
  RiChat3Line,
  RiCodeSSlashLine,
  RiImageLine,
  RiFilmLine,
} from "@remixicon/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sections = [
  {
    href: "/chat",
    title: "Chat",
    description:
      "Ask questions, brainstorm ideas, and get clear answers in a natural back-and-forth.",
    icon: RiChat3Line,
    accent: {
      iconBg: "bg-lime-500/15 dark:bg-lime-400/12",
      iconFg: "text-lime-800 dark:text-lime-300",
      hover: "hover:bg-lime-500/[0.07]",
    },
  },
  {
    href: "/code",
    title: "Code",
    description:
      "Generate snippets, refactor logic, and debug faster with an AI pair programmer.",
    icon: RiCodeSSlashLine,
    accent: {
      iconBg: "bg-sky-500/15 dark:bg-sky-400/12",
      iconFg: "text-sky-800 dark:text-sky-300",
      hover: "hover:bg-sky-500/[0.07]",
    },
  },
  {
    href: "/image",
    title: "Image",
    description:
      "Turn prompts into visuals—concepts, mockups, and assets for your projects.",
    icon: RiImageLine,
    accent: {
      iconBg: "bg-orange-400/20 dark:bg-orange-400/12",
      iconFg: "text-orange-950 dark:text-orange-200",
      hover: "hover:bg-orange-400/[0.09]",
    },
  },
  {
    href: "/video",
    title: "Video",
    description:
      "Turn prompts into short generated clips and keep your video history in one place.",
    icon: RiFilmLine,
    accent: {
      iconBg: "bg-violet-500/15 dark:bg-violet-400/12",
      iconFg: "text-violet-800 dark:text-violet-300",
      hover: "hover:bg-violet-500/[0.07]",
    },
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Overview
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Choose a workspace below or from the sidebar to get started.
      </p>

      <ul className="mt-8 flex list-none flex-col gap-3">
        {sections.map(({ href, title, description, icon: Icon, accent }) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-none outline-none ring-offset-background transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card
                className={cn(
                  "gap-0 py-0 transition-colors",
                  accent.hover
                )}
              >
                <CardHeader className="flex flex-row items-start gap-3 px-4 py-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center",
                      accent.iconBg,
                      accent.iconFg
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
