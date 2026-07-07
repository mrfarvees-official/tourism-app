import Container from "../ui/Container";
import Link from "next/link";

type RouteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function RouteShell({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: RouteShellProps) {
  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
        {actionHref && actionLabel ? (
          <div className="mt-6">
            <Link
              href={actionHref}
              className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              {actionLabel}
            </Link>
          </div>
        ) : null}
      </section>
    </Container>
  );
}
