import Container from "@/src/shared/ui/Container";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Compass,
  MapPinned,
  Mountain,
  Palmtree,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Waves,
} from "lucide-react";

const destinations = [
  {
    name: "Website Builder",
    type: "Drag-and-drop CMS",
    days: "Pages",
    price: "Live",
    highlight: "Create homepages, landing pages, and service pages without code.",
    icon: Mountain,
  },
  {
    name: "Booking Engine",
    type: "Lead capture",
    days: "Forms",
    price: "Live",
    highlight: "Collect inquiries, quote trips, and manage conversion-ready requests.",
    icon: Waves,
  },
  {
    name: "Tour Packages",
    type: "Product management",
    days: "Trips",
    price: "Live",
    highlight: "Publish packages, update inclusions, and keep itinerary content in sync.",
    icon: MapPinned,
  },
  {
    name: "Media Library",
    type: "Asset management",
    days: "Media",
    price: "Live",
    highlight: "Organize destination photos, banners, and content assets in one place.",
    icon: Compass,
  },
  {
    name: "Analytics",
    type: "Performance tracking",
    days: "Insights",
    price: "Live",
    highlight: "See which destinations, pages, and offers generate the most engagement.",
    icon: Palmtree,
  },
];

const packages = [
  {
    title: "Starter Agency",
    price: "$49/mo",
    description: "For agencies that need a branded site, basic pages, and lead capture.",
    features: ["1 website", "Core CMS", "Inquiry forms"],
  },
  {
    title: "Growth Studio",
    price: "$99/mo",
    description: "For teams managing multiple pages, packages, and content updates.",
    features: ["Custom sections", "Package manager", "Theme control"],
  },
  {
    title: "Operations Suite",
    price: "$149/mo",
    description: "For agencies that want workflows, content publishing, and analytics.",
    features: ["Role-based access", "Lead tracking", "Insight dashboards"],
  },
  {
    title: "Multi-Brand Pro",
    price: "Custom",
    description: "For organizations running several travel brands or regional sites.",
    features: ["Multiple tenants", "Custom branding", "Priority support"],
  },
];

const testimonials = [
  {
    name: "Nimal Fernando",
    role: "Agency owner",
    quote:
      "We moved from static pages to a managed site flow. Updating packages and banners now takes minutes.",
  },
  {
    name: "Ayesha Khan",
    role: "Operations manager",
    quote:
      "The CMS is straightforward enough for the team to use, but still structured for real business operations.",
  },
  {
    name: "Daniel Perera",
    role: "Travel consultant",
    quote:
      "The homepage, packages, and lead forms finally live in one platform instead of being scattered across tools.",
  },
];

const steps = [
  {
    title: "Design the site",
    description: "Start with a homepage, service pages, or a destination-focused landing page.",
  },
  {
    title: "Manage content",
    description: "Update tours, images, descriptions, and offers from the CMS dashboard.",
  },
  {
    title: "Track performance",
    description: "Monitor lead flow, page performance, and which packages convert best.",
  },
];

export default function Home() {
  return (
    <Container>
      <main className="pb-20">
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-fg shadow-sm backdrop-blur">
                <SunMedium className="h-4 w-4 text-primary" />
                Built for tourism agencies that need one CMS to design and manage their site.
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-title sm:text-5xl lg:text-6xl">
                Launch and manage tourism websites without rebuilding the same pages twice.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This platform helps tourism agencies create branded websites, publish travel
                packages, manage media, and keep content updated from a single dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/SignIn"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:translate-y-[-1px] hover:bg-primary/90"
                >
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#destinations"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/80 px-6 py-3 text-sm font-semibold text-fg shadow-sm backdrop-blur transition hover:bg-white"
                >
                  See platform modules
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "10 min", label: "To launch a new page" },
                  { value: "Multi-site", label: "Agency ready" },
                  { value: "CMS + CRM", label: "One platform" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="text-2xl font-semibold text-title">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-secondary/10 blur-xl" />
              <div className="rounded-[2rem] border border-border bg-white p-5 shadow-2xl shadow-slate-200/70">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-800 to-primary p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/70">Featured itinerary</p>
                      <h2 className="mt-2 text-2xl font-semibold">Agency homepage builder</h2>
                    </div>
                    <div className="rounded-full bg-white/10 p-3">
                      <Waves className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/70">Pages</p>
                      <p className="mt-2 text-2xl font-semibold">Home, tours, contact</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/70">Templates</p>
                      <p className="mt-2 text-2xl font-semibold">Reusable sections</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/70">Workflow</p>
                      <p className="mt-2 text-2xl font-semibold">Edit, preview, publish</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/70">Audience</p>
                      <p className="mt-2 text-2xl font-semibold">Agencies + teams</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-title">Trusted booking flow</p>
                        <p className="text-sm text-slate-500">Built for lead capture and client requests.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-secondary/10 p-2 text-secondary">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-title">Local recommendations</p>
                        <p className="text-sm text-slate-500">Content blocks agencies can reuse everywhere.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="grid gap-4 rounded-[2rem] border border-border bg-white/80 p-6 shadow-sm sm:grid-cols-3">
            {[
              "Build pages faster with reusable CMS blocks",
              "Manage packages, media, and inquiries in one place",
              "Scale one brand or many agency sites from the same platform",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="destinations" className="py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Destinations</p>
              <h2 className="mt-2 text-3xl font-semibold text-title sm:text-4xl">Core platform modules</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-right">
              The homepage now explains the product clearly: agencies can build, manage, and
              grow their tourism websites from the same system.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {destinations.map((destination) => {
              const Icon = destination.icon;
              return (
                <article
                  key={destination.name}
                  className="group rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {destination.days}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-title">{destination.name}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{destination.type}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{destination.highlight}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">From</p>
                      <p className="text-lg font-semibold text-title">{destination.price}</p>
                    </div>
                    <Link href="/SignIn" className="text-sm font-semibold text-primary transition group-hover:translate-x-0.5">
                      Manage module
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-border bg-slate-900 p-8 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold">A cleaner way to go from idea to live website</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
                Agencies can move from a blank canvas to a branded tourism presence without
                juggling separate design, content, and lead tools.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4 rounded-2xl bg-white/5 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {packages.map((pkg) => (
                <article
                  key={pkg.title}
                  className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-title">{pkg.title}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{pkg.description}</p>
                  <ul className="mt-5 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-2 w-2 rounded-full bg-secondary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/SignIn"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    View plan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Reviews</p>
              <h2 className="mt-2 text-3xl font-semibold text-title sm:text-4xl">What agencies say</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-600 sm:flex">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              4.9 platform score
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-title">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="grid gap-8 rounded-[2rem] border border-border bg-gradient-to-br from-primary to-slate-900 p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Ready to start</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Build the tourism CMS homepage your agency can grow around.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                The page now speaks to agency owners, managers, and content teams who need a
                system for websites, packages, and lead management.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/SignIn"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
              <a
                href="#destinations"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Browse more
              </a>
            </div>
          </div>
        </section>
      </main>
    </Container>
  );
}
