"use client";

import Container from "../ui/Container";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type PublicTourismPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

type PublicDetailPageProps = {
  eyebrow: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  meta?: string;
  fields?: Record<string, unknown>;
  actionHref?: string;
  actionLabel?: string;
  actionNote?: string;
};

const detailFieldBlacklist = new Set([
  "id",
  "slug",
  "title",
  "subtitle",
  "description",
  "status",
  "amount",
  "meta",
  "href",
  "image",
  "image_url",
  "imageUrl",
  "imageAlt",
  "fields",
  "allowedFields",
  "allowed_fields",
  "schema_blueprint",
  "updated_at",
]);

function humanizeField(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    return value.map((item) => formatFieldValue(item)).join(", ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }

  return String(value);
}

export function PublicTourismPage({
  eyebrow,
  title,
  description,
  children,
}: PublicTourismPageProps) {
  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </section>
    </Container>
  );
}

export function PublicDetailPage({
  eyebrow,
  title,
  slug,
  description,
  image,
  meta,
  fields,
  actionHref = "/booking/start",
  actionLabel = "Start booking",
  actionNote = "Request availability from the booking team.",
}: PublicDetailPageProps) {
  const storyFields = Object.entries(fields ?? {})
    .filter(([key, value]) => !detailFieldBlacklist.has(key) && value !== null && value !== undefined && value !== "")
    .slice(0, 4);

  const narrativePoints = [
    fields?.story,
    fields?.highlights,
    fields?.includes,
    fields?.experience,
    fields?.best_for,
    fields?.coverage,
    fields?.route,
    fields?.best_time,
  ]
    .map((value) => formatFieldValue(value))
    .filter((value) => value !== "—")
    .slice(0, 5);

  return (
    <Container className="py-10 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[340px] overflow-hidden bg-slate-950">
            <Image
              src={image ?? "/no-image.jpg"}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
            <div className="relative flex min-h-[340px] flex-col justify-end p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                {eyebrow}
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
                {description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {meta ? (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {meta}
                  </span>
                ) : null}
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                  {slug}
                </span>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-6 p-6 sm:p-8">
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Next step</p>
              <h2 className="mt-3 text-2xl font-semibold">Request availability</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {actionNote}
              </p>
              <div className="mt-6">
                <Link
                  href={actionHref}
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
                >
                  {actionLabel}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {storyFields.length ? (
                storyFields.map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-border bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {humanizeField(key)}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-title">
                      {formatFieldValue(value)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-4 text-sm text-slate-500 sm:col-span-2">
                  Live destination details will appear here once the CMS content is connected.
                </div>
              )}
            </div>
          </aside>
        </div>

        {narrativePoints.length ? (
          <div className="grid gap-3 border-t border-border bg-slate-50 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {narrativePoints.map((point, index) => (
              <div key={`${point}-${index}`} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Story detail
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </Container>
  );
}
