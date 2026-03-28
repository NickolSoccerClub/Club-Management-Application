"use client";

import { useState } from "react";
import {
  Shield,
  ClipboardList,
  Users,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const portals = [
  {
    title: "Committee Portal",
    description: "For committee members",
    icon: Shield,
    href: "/committee",
    color: "from-[#0B2545] to-[#1a3a6b]",
    iconBg: "bg-[#0B2545]/10",
    iconColor: "text-[#0B2545]",
  },
  {
    title: "Coach Portal",
    description: "For coaches & managers",
    icon: ClipboardList,
    href: "/coach",
    color: "from-[#1D4ED8] to-[#3B82F6]",
    iconBg: "bg-[#1D4ED8]/10",
    iconColor: "text-[#1D4ED8]",
  },
  {
    title: "Parent Portal",
    description: "For parents & guardians",
    icon: Users,
    href: "/parent",
    color: "from-[#059669] to-[#10B981]",
    iconBg: "bg-[#059669]/10",
    iconColor: "text-[#059669]",
  },
];

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    // placeholder — would integrate with auth
  }

  function handleMagicSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMagicSent(true);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0B2545] sm:text-4xl">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Choose your portal or sign in below to access your dashboard.
            </p>
          </div>

          {/* Portal cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <a key={portal.title} href={portal.href} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", portal.iconBg)}>
                        <Icon className={cn("h-7 w-7", portal.iconColor)} />
                      </div>
                      <h2 className="mt-4 text-base font-semibold text-[#0B2545]">
                        {portal.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">{portal.description}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1D4ED8] group-hover:gap-2 transition-all">
                        Enter
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 text-sm text-gray-500">or sign in with your account</span>
            </div>
          </div>

          {/* Login form */}
          <div className="mx-auto max-w-md">
            <Card>
              <CardContent className="p-6">
                {/* Method toggle */}
                <div className="mb-6 flex rounded-lg border border-gray-200 p-1">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod("password"); setMagicSent(false); }}
                    className={cn(
                      "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      loginMethod === "password"
                        ? "bg-[#0B2545] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Password
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod("magic"); setMagicSent(false); }}
                    className={cn(
                      "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      loginMethod === "magic"
                        ? "bg-[#0B2545] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Magic Link
                    </span>
                  </button>
                </div>

                {loginMethod === "password" && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-end">
                      <a href="#" className="text-sm font-medium text-[#1D4ED8] hover:text-[#0B2545] transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <Button type="submit" variant="accent" size="lg" className="w-full">
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        Sign In
                      </span>
                    </Button>
                  </form>
                )}

                {loginMethod === "magic" && !magicSent && (
                  <form onSubmit={handleMagicSubmit} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      We&apos;ll send a secure sign-in link to your email. No password needed.
                    </p>
                    <Button type="submit" variant="accent" size="lg" className="w-full">
                      <span className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Magic Link
                      </span>
                    </Button>
                  </form>
                )}

                {loginMethod === "magic" && magicSent && (
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#0B2545]">Check Your Email</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      We&apos;ve sent a magic link to <span className="font-medium">{email}</span>.
                      Click the link in the email to sign in.
                    </p>
                    <button
                      onClick={() => setMagicSent(false)}
                      className="mt-4 text-sm font-medium text-[#1D4ED8] hover:text-[#0B2545] transition-colors"
                    >
                      Try a different email
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
