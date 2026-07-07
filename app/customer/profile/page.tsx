"use client";

import { useEffect, useState, type FormEvent } from "react";
import Container from "@/src/shared/ui/Container";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { http } from "@/src/api/config/http";

type Profile = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  preferredLanguage: string;
  emergencyContact: string;
  address: string;
  updatedAt: string;
};

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
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    passportNumber: "",
    preferredLanguage: "",
    emergencyContact: "",
    address: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await http.get("/api/customer/profile", {
          params: { tenantKey: "lanka-trails" },
        });
        if (active) setProfile((response.data?.data ?? profile) as Profile);
      } catch {
        if (active) setMessage("Unable to load profile details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await http.patch("/api/customer/profile", {
        tenantKey: "lanka-trails",
        ...profile,
      });
      setProfile((response.data?.data ?? profile) as Profile);
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Customer profile</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
              Keep your trip details up to date
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Update contact details once and keep every booking, payment reminder, and support request aligned.
            </p>
          </div>
          <Link href="/customer/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-title">
            Back to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={saveProfile} className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
            <Field label="Email" value={profile.email} onChange={(value) => setProfile((current) => ({ ...current, email: value }))} />
            <Field label="Phone" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
            <Field label="Nationality" value={profile.nationality} onChange={(value) => setProfile((current) => ({ ...current, nationality: value }))} />
            <Field label="Passport number" value={profile.passportNumber} onChange={(value) => setProfile((current) => ({ ...current, passportNumber: value }))} />
            <Field label="Preferred language" value={profile.preferredLanguage} onChange={(value) => setProfile((current) => ({ ...current, preferredLanguage: value }))} />
            <Field label="Emergency contact" value={profile.emergencyContact} onChange={(value) => setProfile((current) => ({ ...current, emergencyContact: value }))} />
            <Field label="Address" value={profile.address} onChange={(value) => setProfile((current) => ({ ...current, address: value }))} />
          </div>

          <aside className="rounded-[1.75rem] border border-border bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Profile sync</p>
                <h2 className="mt-1 text-2xl font-semibold">What changes here</h2>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
              <li>Bookings inherit your contact details.</li>
              <li>Support requests use the latest phone and email.</li>
              <li>Travel notes stay consistent across review and payment flows.</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/75">
              Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "Not saved yet"}
            </div>
            {message ? <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-950">{message}</div> : null}
            <button
              type="submit"
              disabled={saving || loading}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </aside>
        </form>
      </section>
    </Container>
  );
}
