"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Compass, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type AuthMode = "login" | "register";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ConsumerAuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setMessage("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setMessage("The two passwords do not match.");
      return;
    }
    if (isRegister && !termsAccepted) {
      setMessage("Review and accept the Terms and Privacy Notice first.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("The identity service is not configured for this preview.");
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const { data, error } = isRegister
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;

      if (!data.session) {
        setMessage("Your sign-up request was submitted. Confirm the email from Supabase before signing in.");
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const payload = (await response.json()) as {
        user?: { role?: "user" | "admin" | "super_admin" };
        error?: { message?: string };
      };
      if (!response.ok || !payload.user?.role) {
        throw new Error(payload.error?.message ?? "The account role is not ready yet.");
      }

      router.replace(payload.user.role === "user" ? "/" : "/ops");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-in could not be completed right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#f7f8f5] text-[#1e2939]">
      <div className="mx-auto min-h-dvh max-w-[390px] bg-white shadow-[0_0_0_1px_rgba(30,87,56,0.04)]">
        <header className="flex min-h-14 items-center justify-between px-5 py-3">
          <Link
            href="/"
            aria-label="Return to home"
            className="grid size-11 place-items-center rounded-full text-[#1e5738] hover:bg-[#edf6ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e5738]"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <p className="text-[22px] font-bold tracking-[-0.55px] text-[#1e5738]">Wayly</p>
          <span className="size-11" />
        </header>

        <section className="px-5 pb-10 pt-2">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4eb] text-[#1e5738]">
            <Compass className="size-6" />
          </div>
          <h1 className="mt-4 text-[22px] font-bold tracking-[-0.4px] text-[#101828]">
            {isRegister ? "Create an account" : "Sign in to Wayly"}
          </h1>
          <p className="mt-1 text-xs leading-5 text-[#99a1af]">Save your NYC itineraries and exploration preferences.</p>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-[#f3f4f6] p-1">
            <Link
              href="/login"
              className={`flex h-9 items-center justify-center rounded-full text-sm font-semibold ${isRegister ? "text-[#6a7282]" : "bg-white text-[#1e5738] shadow-sm"}`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={`flex h-9 items-center justify-center rounded-full text-sm font-semibold ${isRegister ? "bg-white text-[#1e5738] shadow-sm" : "text-[#6a7282]"}`}
            >
              Create account
            </Link>
          </div>

          <form className="mt-6 space-y-3.5" onSubmit={submit}>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#6a7282]">Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#e5e7eb] px-3.5 text-sm outline-none placeholder:text-[#c6cbd3] focus:border-[#1e5738]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#6a7282]">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-12 w-full rounded-xl border border-[#e5e7eb] px-3.5 pr-12 text-sm outline-none placeholder:text-[#c6cbd3] focus:border-[#1e5738]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[#99a1af] hover:bg-[#f3f4f6]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>
            {isRegister ? (
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#6a7282]">Confirm password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  className="h-12 w-full rounded-xl border border-[#e5e7eb] px-3.5 text-sm outline-none placeholder:text-[#c6cbd3] focus:border-[#1e5738]"
                />
              </label>
            ) : (
              <p className="text-right">
                <button
                  type="button"
                  onClick={() => setMessage("Password recovery will be available after the identity service is configured.")}
                  className="text-xs font-semibold text-[#1e5738]"
                >
                  Forgot password?
                </button>
              </p>
            )}
            {isRegister ? (
              <label className="flex items-start gap-2.5 rounded-2xl bg-[#f8f9f8] p-3 text-xs leading-5 text-[#6a7282]">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  className="mt-0.5 size-4 accent-[#1e5738]"
                />
                <span>
                  I have read and agree to the
                  <button type="button" className="px-1 font-semibold text-[#1e5738]" onClick={() => setMessage("The Terms are not published in this preview.")}>
                    Terms
                  </button>
                  and
                  <button type="button" className="px-1 font-semibold text-[#1e5738]" onClick={() => setMessage("The Privacy Notice is not published in this preview.")}>
                    Privacy Notice
                  </button>
                </span>
              </label>
            ) : null}

            {message ? (
              <output className="block rounded-2xl bg-[#f6fbf7] px-3.5 py-3 text-xs leading-5 text-[#557462]">
                {message}
              </output>
            ) : null}

            <Button
              size="lg"
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-2xl bg-[#1e5738] text-sm font-semibold hover:bg-[#18492f]"
            >
              {submitting ? "Submitting…" : isRegister ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-[11px] leading-5 text-[#99a1af]">
            {isRegister
              ? "After registration, you can save itineraries, bookmark places, and sync preferences."
              : "After sign-in, you can view saved itineraries, bookmarked places, and synced preferences."}
          </p>

          <Link
            href="/"
            className="mt-5 flex min-h-11 items-center justify-center text-sm font-semibold text-[#1e5738]"
          >
            Continue as a guest
          </Link>

          <div className="mt-6 rounded-2xl bg-[#eef8f1] p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#1e5738]">
              <ShieldCheck className="size-4" />
              Supabase Auth · local preview
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#557462]">
              Registration does not grant or elevate roles. A server-side database trigger initializes new accounts as ordinary users. Do not enter production credentials in this preview.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
