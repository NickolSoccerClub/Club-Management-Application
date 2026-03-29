"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/lib/stores/toast-store";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : authError.message
        );
        setIsLoading(false);
        return;
      }

      addToast("Signed in successfully. Welcome back!", "success");
      router.push("/committee");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#0B2545] px-12 text-white">
        <div className="mx-auto max-w-md text-center">
          {/* Club shield icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Shield className="h-14 w-14 text-white" />
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            Nickol Soccer Club
          </h1>
          <p className="mt-3 text-lg text-blue-200">
            Manage your club, teams, and players — all in one place.
          </p>

          {/* Decorative dots */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-8 rounded-full bg-white/50" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Right login form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Mobile branding - visible only on small screens */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0B2545]">
            <Shield className="h-9 w-9 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#0B2545]">
            Nickol Soccer Club
          </h1>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-600">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="current-password"
            />

            {/* Error display */}
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-medium text-[#1D4ED8] hover:text-[#0B2545] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href="mailto:admin@nickolsoccer.com"
              className="font-medium text-[#1D4ED8] hover:text-[#0B2545] transition-colors"
            >
              Contact your club administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
