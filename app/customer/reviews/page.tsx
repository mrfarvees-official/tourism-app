"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Container from "@/src/shared/ui/Container";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { http } from "@/src/api/config/http";

type Review = {
  id: string;
  bookingId: string;
  title: string;
  message: string;
  rating: number;
  status: string;
  createdAt: string;
};

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    bookingId: "",
    title: "",
    message: "",
    rating: 5,
  });

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await http.get("/api/customer/reviews", {
          params: { tenantKey: "lanka-trails" },
        });
        if (active) setReviews((response.data?.data ?? []) as Review[]);
      } catch {
        if (active) setMessage("Unable to load reviews.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReviews();
    return () => {
      active = false;
    };
  }, []);

  const publishedCount = useMemo(() => reviews.filter((review) => review.status === "published").length, [reviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await http.post("/api/customer/reviews", {
        tenantKey: "lanka-trails",
        ...form,
      });
      const payload = response.data?.data as Review | undefined;
      setReviews((current) => [payload ?? formToReview(form), ...current]);
      setForm({ bookingId: "", title: "", message: "", rating: 5 });
      setMessage("Review submitted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Customer reviews</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
              Share feedback after each trip
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Use this page to capture trip ratings, notes, and final feedback in a format support can review quickly.
            </p>
          </div>
          <Link href="/customer/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-title">
            Back to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={submitReview} className="rounded-[1.75rem] border border-border bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-title">Leave a review</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Booking reference" value={form.bookingId} onChange={(value) => setForm((current) => ({ ...current, bookingId: value }))} />
              <Field label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Rating</span>
                <select
                  value={form.rating}
                  onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Feedback</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  rows={6}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
              </label>
            </div>
            {message ? <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{message}</div> : null}
            <button
              type="submit"
              disabled={saving || loading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Submit review"}
            </button>
          </form>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Feedback inbox</p>
                  <h2 className="mt-2 text-2xl font-semibold text-title">{publishedCount} published review{publishedCount === 1 ? "" : "s"}</h2>
                </div>
                <Star className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            <div className="grid gap-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {review.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-title">{review.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{review.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </article>
              ))}
              {!loading && reviews.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-border bg-slate-50 p-8 text-center text-slate-600">
                  No reviews yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3" />
    </label>
  );
}

function formToReview(form: { bookingId: string; title: string; message: string; rating: number }) {
  return {
    id: `review-${Date.now()}`,
    bookingId: form.bookingId,
    title: form.title,
    message: form.message,
    rating: form.rating,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
}
