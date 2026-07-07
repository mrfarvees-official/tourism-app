import Container from "@/src/shared/ui/Container";
import Link from "next/link";

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">
      <section className="grid gap-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
            Talk to the tourism team
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Use this page for inquiries, booking requests, and service questions.
          </p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">Next step</p>
          <h2 className="mt-3 text-2xl font-semibold">Send an inquiry</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Use the booking start page if you already know the package you want.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/booking/start" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Book now
            </Link>
            <Link href="/packages" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
              Browse packages
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}
