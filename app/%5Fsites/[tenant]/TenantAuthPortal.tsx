"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "@/src/shared/ui/Container";
import { clearAuthError, login, register } from "@/src/shared/redux/store/authSlice";
import type { AppDispatch, RootState } from "@/src/shared/redux/store";

type Mode = "signin" | "signup";

type Props = {
  tenant: string;
  mode: Mode;
};

export default function TenantAuthPortal({ tenant, mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const requestStatus = useSelector((s: RootState) => s.auth.requestStatus);
  const authError = useSelector((s: RootState) => s.auth.error);
  const isLoading = requestStatus === "loading";

  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    setError(authError ?? null);
  }, [authError]);

  useEffect(() => {
    if (error) dispatch(clearAuthError());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, passwordConfirmation]);

  const next = searchParams.get("next") || "/customer/dashboard";

  function validateSignIn() {
    if (!email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  function validateSignUp() {
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

    if (mode === "signin") {
      const validationError = validateSignIn();
      if (validationError) {
        setError(validationError);
        return;
      }

      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        router.replace(next);
        return;
      }

      setError((result.payload as string) || "Login failed.");
      return;
    }

    const validationError = validateSignUp();
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
        tenantKey: tenant,
      }),
    );

    if (register.fulfilled.match(result)) {
      router.replace(next);
      return;
    }

    setError((result.payload as string) || "Register failed.");
  }

  return (
    <Container className="flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {tenant}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-title">
            {mode === "signin" ? "Customer sign in" : "Customer sign up"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {mode === "signin"
              ? "Use your shared customer account to access this tenant."
              : "Create a customer profile for this tenant and keep future visits tied to the same account."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" ? (
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
          ) : null}

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
              placeholder="customer@example.com"
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
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {mode === "signup" ? (
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
          ) : null}

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
            {isLoading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            {mode === "signin" ? "Need a customer account? " : "Already registered? "}
            <Link
              href={mode === "signin" ? "/signup" : "/signin"}
              className="font-semibold text-primary"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}
