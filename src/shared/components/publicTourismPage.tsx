"use client";

import Container from "../ui/Container";
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
  actionHref?: string;
  actionLabel?: string;
};

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
  actionHref = "/booking/start",
  actionLabel = "Start booking",
}: PublicDetailPageProps) {
  return (
    <Container className="py-10 sm:py-14">
      <section className="grid gap-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            {slug}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
        </div>

        <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">Next step</p>
          <h2 className="mt-3 text-2xl font-semibold">Request availability</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Review the details, then start a booking request for this item.
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
      </section>
    </Container>
  );
}
