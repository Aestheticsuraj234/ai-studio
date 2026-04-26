import Link from "next/link";
import {
  RiSparklingLine,
  RiChat3Line,
  RiCodeSSlashLine,
  RiImageLine,
  RiMusic2Line,
  RiFilmLine,
  RiArrowRightLine,
  RiCheckLine,
  RiFlashlightLine,
  RiTimeLine,
  RiStackLine,
  RiGithubLine,
  RiTwitterXLine,
  RiBookOpenLine,
  RiStarFill,
  RiPlayCircleLine,
} from "@remixicon/react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { getCurrentUser } from "@/lib/auth";

const features = [
  {
    icon: RiChat3Line,
    title: "AI Chat Assistant",
    description:
      "Conversational AI that understands context, remembers chats, and helps you think faster.",
  },
  {
    icon: RiCodeSSlashLine,
    title: "Code Generator",
    description:
      "Generate, refactor and explain code across 40+ languages with production-ready output.",
  },
  {
    icon: RiImageLine,
    title: "Image Generator",
    description:
      "Turn prompts into pixel-perfect images, illustrations, and brand assets in seconds.",
  },
  {
    icon: RiMusic2Line,
    title: "Music Generator",
    description:
      "Compose royalty-free tracks, loops and SFX tailored to mood, genre and tempo.",
  },
  {
    icon: RiFilmLine,
    title: "Video Generator",
    description:
      "Render short-form videos from a single prompt — perfect for ads, demos and reels.",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter your prompt",
    description:
      "Describe what you want in plain English. No syntax, no setup, no friction.",
  },
  {
    number: "02",
    title: "AI processes instantly",
    description:
      "Our multi-model pipeline picks the best engine for the job and runs it on fast infra.",
  },
  {
    number: "03",
    title: "Get your output",
    description:
      "Receive text, code, images, music or video — ready to ship, share, or iterate on.",
  },
];

const benefits = [
  {
    icon: RiTimeLine,
    title: "Save hours every day",
    description:
      "Replace half a dozen subscriptions and tabs with a single, focused workspace.",
  },
  {
    icon: RiStackLine,
    title: "All tools in one place",
    description:
      "Chat, code, image, music and video — connected through one prompt history.",
  },
  {
    icon: RiFlashlightLine,
    title: "Boost productivity 10x",
    description:
      "Built for speed: keyboard-first UI, streaming output, and zero context switching.",
  },
];

const testimonials = [
  {
    quote:
      "I cancelled four subscriptions the week I switched to AIverse. The chat → code → image flow is unreal.",
    name: "Maya Chen",
    role: "Indie Hacker",
  },
  {
    quote:
      "Our team ships landing pages in an afternoon now. Copy, hero image, demo video — all from one prompt bar.",
    name: "David Okafor",
    role: "Startup Founder",
  },
  {
    quote:
      "It feels like Linear-grade craft, but for AI. Finally a workspace I actually want to live inside.",
    name: "Priya Natarajan",
    role: "Product Designer",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to explore AIverse.",
    features: [
      "100 chat messages / month",
      "20 image generations",
      "5 music & video clips",
      "Community support",
    ],
    cta: "Get started",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For builders and creators going full-time on AI.",
    features: [
      "Unlimited chat & code",
      "1,000 image generations",
      "200 music & video clips",
      "Priority models & speed",
      "API access & history export",
    ],
    cta: "Upgrade to Pro",
    href: "/register",
    highlight: true,
  },
];

const trustedLogos = [
  "Acme",
  "Northwind",
  "Stellar",
  "Lumen",
  "Vortex",
  "Quanta",
];

export default async function Home() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Open dashboard" : "Get started";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <BackgroundDecor />

      <SiteHeader user={user} />

      <main className="relative">
        <Hero primaryHref={primaryHref} primaryLabel={primaryLabel} />
        <SocialProof />
        <Features />
        <HowItWorks />
        <ProductPreview />
        <Benefits />
        <Pricing />
        <Testimonials />
        <FinalCTA primaryHref={primaryHref} primaryLabel={primaryLabel} />
      </main>

      <SiteFooter />
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
      <div className="absolute top-[40%] -left-32 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-3xl" />
      <div className="absolute top-[60%] -right-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

function SiteHeader({ user }: { user: unknown }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <RiSparklingLine className="h-4 w-4" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight">
            AIverse
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-foreground"
          >
            Customers
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-8 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero({
  primaryHref,
  primaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 lg:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Now in public beta — 5 tools, one workspace
          </div>

          <h1 className="mt-6 font-heading text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            One AI.{" "}
            <span className="text-primary">Infinite Possibilities.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
            AIverse is the all-in-one workspace for chat, code, images, music,
            and video. Stop juggling tabs and subscriptions — create anything
            from a single prompt bar built for developers, creators, and
            founders.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-transform hover:-translate-y-0.5"
            >
              {primaryLabel}
              <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#preview"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-6 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
            >
              <RiPlayCircleLine className="h-4 w-4" />
              View demo
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <RiCheckLine className="h-3.5 w-3.5 text-primary" /> No credit
              card required
            </span>
            <span className="flex items-center gap-1.5">
              <RiCheckLine className="h-3.5 w-3.5 text-primary" /> 100 free
              credits
            </span>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-2xl dark:bg-primary/20" />
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 text-[10px] text-muted-foreground">
            aiverse.app/chat
          </span>
        </div>

        <div className="grid grid-cols-[140px_1fr] text-xs">
          <aside className="border-r border-border/60 bg-muted/20 p-3">
            <p className="px-2 pb-2 text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
              Tools
            </p>
            <ul className="space-y-0.5">
              {[
                { icon: RiChat3Line, label: "Chat", active: true },
                { icon: RiCodeSSlashLine, label: "Code" },
                { icon: RiImageLine, label: "Image" },
                { icon: RiMusic2Line, label: "Music" },
                { icon: RiFilmLine, label: "Video" },
              ].map((item) => (
                <li
                  key={item.label}
                  className={[
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                    item.active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-3 p-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-foreground px-3 py-2 text-[11px] text-background">
                Build me a hero section for a fintech landing page.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border/60 bg-background px-3 py-2 text-[11px]">
                <p className="font-medium">Sure — here&apos;s a starter:</p>
                <pre className="mt-2 overflow-x-auto rounded-md bg-muted/60 p-2 text-[10px] leading-relaxed text-muted-foreground">
                  {`<section className="hero">\n  <h1>Banking, reinvented.</h1>\n  <p>Move money in seconds.</p>\n</section>`}
                </pre>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2">
              <RiSparklingLine className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                Ask AIverse anything…
              </span>
              <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                ⌘ K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="relative border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-center text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Trusted by developers &amp; creators worldwide
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-6 sm:grid-cols-6">
          {trustedLogos.map((logo) => (
            <div
              key={logo}
              className="text-center font-heading text-sm font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Features"
        title="Five tools. One prompt bar."
        description="Everything you need to chat, build, design, score and film — without leaving your workspace."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={[
              "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-xl",
              i === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3",
              i === 1 ? "lg:col-span-3" : "",
              i === 2 ? "lg:col-span-2" : "",
              i === 3 ? "lg:col-span-2" : "",
              i === 4 ? "lg:col-span-2" : "",
            ].join(" ")}
          >
            <div className="absolute inset-0 -z-10 bg-muted/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-foreground backdrop-blur">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-heading text-base font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-2 max-w-sm text-xs/relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="How it works"
        title="From idea to output in 3 steps."
        description="No setup, no models to wire up, no boilerplate — just describe and ship."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-semibold tracking-tight text-primary">
                {step.number}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden flex-1 border-t border-dashed border-border md:block" />
              )}
            </div>
            <h3 className="mt-4 font-heading text-base font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-xs/relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section id="preview" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Product"
        title="A workspace built for craft."
        description="Keyboard-first, command-palette-driven, beautifully fast. Designed to stay out of your way."
      />

      <div className="relative mt-14">
        <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="ml-4 text-[11px] text-muted-foreground">
              aiverse.app
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-border/60 p-5 lg:border-r lg:border-b-0">
              <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Workspace
              </p>
              <ul className="mt-3 space-y-1 text-xs">
                {[
                  { icon: RiChat3Line, label: "Chat", active: true },
                  { icon: RiCodeSSlashLine, label: "Code" },
                  { icon: RiImageLine, label: "Image" },
                  { icon: RiMusic2Line, label: "Music" },
                  { icon: RiFilmLine, label: "Video" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className={[
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                      item.active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    ].join(" ")}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Recent
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li className="truncate rounded-lg px-2.5 py-1.5 hover:bg-muted/60 hover:text-foreground">
                  Landing page hero
                </li>
                <li className="truncate rounded-lg px-2.5 py-1.5 hover:bg-muted/60 hover:text-foreground">
                  Lo-fi study beat
                </li>
                <li className="truncate rounded-lg px-2.5 py-1.5 hover:bg-muted/60 hover:text-foreground">
                  Product reveal video
                </li>
              </ul>
            </aside>

            <div className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-lg font-semibold tracking-tight">
                    New chat
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    GPT-class reasoning · streaming on
                  </p>
                </div>
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[10px] text-muted-foreground">
                  context: 128k
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Generations", value: "1,284" },
                  { label: "Tokens saved", value: "3.2M" },
                  { label: "Avg. latency", value: "0.8s" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/60 bg-background/60 p-4"
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-heading text-xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <RiSparklingLine className="h-3.5 w-3.5 text-primary" />
                  Suggested prompts
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Generate a SaaS hero section",
                    "Compose a 30s lo-fi loop",
                    "Refactor this React component",
                    "Create a product reveal video",
                  ].map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-4 py-3">
                <RiSparklingLine className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Ask AIverse anything…
                </span>
                <span className="ml-auto rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘ K
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Why AIverse"
        title="Built to make you faster."
        description="The fewer tabs you open, the more you ship. AIverse compresses your AI stack into one focused surface."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-heading text-base font-semibold tracking-tight">
              {b.title}
            </h3>
            <p className="mt-2 text-xs/relaxed text-muted-foreground">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple, honest pricing."
        description="Start free. Upgrade when you outgrow it. Cancel anytime."
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
        {pricing.map((plan) => (
          <div
            key={plan.name}
            className={[
              "relative rounded-2xl border p-8 backdrop-blur-sm transition-all",
              plan.highlight
                ? "border-primary/40 bg-primary/5 shadow-xl ring-1 ring-primary/30"
                : "border-border/60 bg-card/60 hover:border-border",
            ].join(" ")}
          >
            {plan.highlight && (
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <p className="font-heading text-sm font-semibold tracking-tight">
              {plan.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan.description}
            </p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-heading text-5xl font-semibold tracking-tight">
                {plan.price}
              </span>
              <span className="text-xs text-muted-foreground">{plan.period}</span>
            </div>

            <Link
              href={plan.href}
              className={[
                "mt-6 inline-flex h-10 w-full items-center justify-center rounded-full text-xs font-medium transition-opacity",
                plan.highlight
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border bg-background hover:bg-muted",
              ].join(" ")}
            >
              {plan.cta}
            </Link>

            <ul className="mt-6 space-y-2.5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <RiCheckLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Customers"
        title="Loved by builders."
        description="The kind of feedback we love waking up to."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
          >
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <RiStarFill key={i} className="h-3.5 w-3.5" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm/relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-heading text-xs font-semibold">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <span>
                <span className="block text-xs font-medium">{t.name}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {t.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({
  primaryHref,
  primaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-10 text-center backdrop-blur-xl sm:p-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-primary/5"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
          Start building with AI today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Join thousands of developers and creators using AIverse as their
          daily AI workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-transform hover:-translate-y-0.5"
          >
            {primaryLabel}
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background/60 px-6 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="relative border-t border-border/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <RiSparklingLine className="h-3.5 w-3.5" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight">
            AIverse
          </span>
          <span className="ml-3 text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} AIverse Labs
          </span>
        </div>

        <nav className="flex items-center gap-5 text-xs text-muted-foreground">
          <a
            href="https://github.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <RiGithubLine className="h-4 w-4" /> GitHub
          </a>
          <a
            href="https://twitter.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <RiTwitterXLine className="h-4 w-4" /> Twitter
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <RiBookOpenLine className="h-4 w-4" /> Docs
          </a>
        </nav>
      </div>
    </footer>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase backdrop-blur">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm/relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
