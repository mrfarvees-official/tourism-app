"use client";

import Container from "@/src/shared/ui/Container";
import { AppDispatch, RootState } from "@/src/shared/redux/store";
import { clearAuthError, register } from "@/src/shared/redux/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const requestStatus = useSelector((s: RootState) => s.auth.requestStatus);
  const authError = useSelector((s: RootState) => s.auth.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoading = requestStatus === "loading";

  useEffect(() => {
    setError(authError ?? null);
  }, [authError]);

  useEffect(() => {
    if (error) dispatch(clearAuthError());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, passwordConfirmation]);

  function validate() {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter a password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== passwordConfirmation) return "Passwords do not match.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = await dispatch(
      register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        tenantKey: searchParams.get("tenantKey") || undefined,
      }),
    );

    if (register.fulfilled.match(result)) {
      router.replace("/");
      return;
    }

    setError((result.payload as string) || "Register failed.");
  }

  return (
    <Container className="flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Create account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-title">
            Start managing your tourism brand
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Register to manage your tenant, content, and business operations in one place.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password_confirmation" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/SignIn" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}
