import Container from "@/src/shared/ui/Container";

const metrics = [
  ["Total destinations", "12"],
  ["Active packages", "18"],
  ["Total services", "9"],
  ["Total bookings", "42"],
  ["Pending bookings", "8"],
  ["Total revenue", "LKR 1,250,000"],
];

export default function BusinessDashboardPage() {
  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Business dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
          Tourism operations at a glance
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          This route is ready for the tenant-scoped business dashboard API and admin widgets.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-title">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
