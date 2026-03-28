"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  FileText,
  DollarSign,
  ClipboardCheck,
  TrendingUp,
  Megaphone,
  Calendar,
  Wrench,
  UserPlus,
  CheckCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

interface CommitteeRole {
  title: string;
  description: string;
  hours: string;
  filled: boolean;
  icon: React.ElementType;
}

const roles: CommitteeRole[] = [
  {
    title: "President",
    description:
      "Lead the club's strategic direction, chair committee meetings, and serve as the primary representative to external bodies and the broader community.",
    hours: "4-6",
    filled: true,
    icon: Shield,
  },
  {
    title: "Vice President",
    description:
      "Support the President in all club duties, step in during their absence, and help coordinate cross-committee projects and initiatives.",
    hours: "3-5",
    filled: true,
    icon: Users,
  },
  {
    title: "Secretary",
    description:
      "Manage official correspondence, prepare meeting agendas and minutes, and maintain the club's records and documentation.",
    hours: "3-4",
    filled: false,
    icon: FileText,
  },
  {
    title: "Treasurer",
    description:
      "Oversee financial management, process registrations and fees, prepare budgets, and provide regular financial reports to the committee.",
    hours: "3-5",
    filled: true,
    icon: DollarSign,
  },
  {
    title: "Registrar",
    description:
      "Handle player registrations, maintain membership databases, coordinate with Football West, and ensure compliance with all registration requirements.",
    hours: "2-4",
    filled: false,
    icon: ClipboardCheck,
  },
  {
    title: "Development Officer",
    description:
      "Coordinate coaching development programs, organise training workshops, and oversee player pathways from grassroots to senior levels.",
    hours: "2-3",
    filled: false,
    icon: TrendingUp,
  },
  {
    title: "Communications Officer",
    description:
      "Manage social media accounts, website content, newsletters, and all internal and external communications for the club.",
    hours: "2-4",
    filled: false,
    icon: Megaphone,
  },
  {
    title: "Events Coordinator",
    description:
      "Plan and execute club events including presentation nights, fundraisers, social gatherings, and community engagement activities.",
    hours: "2-3",
    filled: false,
    icon: Calendar,
  },
  {
    title: "Equipment Coordinator",
    description:
      "Manage club equipment inventory, coordinate kit distribution, ensure grounds and equipment meet safety standards before each season.",
    hours: "1-2",
    filled: true,
    icon: Wrench,
  },
  {
    title: "General Committee Member",
    description:
      "Contribute to club decision-making, assist other committee members with projects, and help at game days and club events as needed.",
    hours: "1-2",
    filled: false,
    icon: UserPlus,
  },
];

export default function CommitteeEOIPage() {
  const [nominatingRole, setNominatingRole] = useState<string | null>(null);
  const [submittedRole, setSubmittedRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    statement: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedRole(nominatingRole);
    setNominatingRole(null);
    setForm({ fullName: "", email: "", phone: "", statement: "" });
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8]/10">
              <Shield className="h-7 w-7 text-[#1D4ED8]" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#0B2545] sm:text-4xl">
              Committee Roles
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-xl mx-auto">
              Our club runs on volunteers. Explore the committee positions below and
              nominate yourself for any open role. Every contribution makes a difference.
            </p>
          </div>

          {/* Submitted banner */}
          {submittedRole && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
              <p className="text-sm text-green-800">
                Your nomination for <span className="font-semibold">{submittedRole}</span> has been submitted.
                The committee will review and be in touch.
              </p>
              <button onClick={() => setSubmittedRole(null)} className="ml-auto shrink-0 text-green-600 hover:text-green-800">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Role grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isNominating = nominatingRole === role.title;

              return (
                <Card
                  key={role.title}
                  className={cn(
                    "flex flex-col transition-shadow hover:shadow-md",
                    isNominating && "ring-2 ring-[#1D4ED8]"
                  )}
                >
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B2545]/5">
                        <Icon className="h-5 w-5 text-[#0B2545]" />
                      </div>
                      <Badge variant={role.filled ? "default" : "success"}>
                        {role.filled ? "Filled" : "Open"}
                      </Badge>
                    </div>

                    <h3 className="mt-3 text-base font-semibold text-[#0B2545]">
                      {role.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm text-gray-600 leading-relaxed">
                      {role.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      ~{role.hours} hrs/week
                    </p>

                    {/* Nominate button or inline form */}
                    {!isNominating && (
                      <Button
                        variant={role.filled ? "secondary" : "accent"}
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => {
                          setNominatingRole(role.title);
                          setSubmittedRole(null);
                        }}
                      >
                        {role.filled ? "Nominate Anyway" : "Nominate"}
                      </Button>
                    )}

                    {isNominating && (
                      <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                        <Input
                          label="Full Name"
                          placeholder="Your name"
                          required
                          value={form.fullName}
                          onChange={(e) => update("fullName", e.target.value)}
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          placeholder="04XX XXX XXX"
                          required
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                        />
                        <div className="w-full">
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Brief Statement
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Why you'd be great for this role..."
                            value={form.statement}
                            onChange={(e) => update("statement", e.target.value)}
                            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" variant="accent" size="sm" className="flex-1">
                            Submit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setNominatingRole(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
